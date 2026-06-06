#!/usr/bin/env python3
# Fix garbled PDF-extracted math in quest/data/game_data.js.
# All special chars use chr() so no non-ASCII appears in this source file.
import re
import json
import sys

# Special characters (chr() keeps source file ASCII-safe for linter)
MINUS       = chr(0x2212)
DIAERESIS   = chr(0x00A8)
PUA_OPEN    = chr(0xF8F1)
PUA_MID     = chr(0xF8F2)
PUA_CLOSE   = chr(0xF8F3)
PUA_FILL    = chr(0xF8F4)
PUA_MATRIX  = ''.join(chr(c) for c in (0xF8EE, 0xF8EF, 0xF8F0, 0xF8F9, 0xF8FA, 0xF8FB))
NOT_EQ_COMB = chr(0x0338)
FLOOR_L     = chr(0x00A1)
FLOOR_R     = chr(0x00A4)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _apply_outside_math(text, rules):
    """Apply regex rules only to segments OUTSIDE $...$ blocks."""
    parts = text.split('$')
    for i in range(0, len(parts), 2):   # even indices = outside math
        for pattern, repl in rules:
            try:
                parts[i] = re.sub(pattern, repl, parts[i])
            except Exception:
                pass
    return '$'.join(parts)


# ---------------------------------------------------------------------------
# Bracket-fraction engine
# ---------------------------------------------------------------------------

def extract_bracket(text, open_c, close_c):
    if not text or text[0] != open_c:
        return None
    depth = 0
    for j, c in enumerate(text):
        if c == open_c:
            depth += 1
        elif c == close_c:
            depth -= 1
            if depth == 0:
                return text[1:j], j + 1
    return None


def render_bracket(content, left, right):
    if '\n' in content:
        num, den = content.split('\n', 1)
        num = num.strip()
        den = den.strip()
        # If denominator still has newlines it's a matrix row, not a fraction
        if '\n' in den:
            return left + content.strip() + right
        if left == '(':
            return r'$\left(\frac{' + num + '}{' + den + r'}\right)$'
        elif left == '[':
            return r'$\left[\frac{' + num + '}{' + den + r'}\right]$'
    return left + content.strip() + right


def process_brackets(text, pairs):
    for _ in range(30):
        made = False
        for open_c, close_c, left, right in pairs:
            if open_c not in text:
                continue
            result = []
            i = 0
            while i < len(text):
                if text[i] == open_c:
                    r = extract_bracket(text[i:], open_c, close_c)
                    if r:
                        content, span = r
                        rendered = render_bracket(content, left, right)
                        end = i + span
                        em = re.match(
                            r'\x01([^\n\x01\x10\x11\x81\x8b\x14\x15\x80\x8a ,;]+)',
                            text[end:]
                        )
                        if em:
                            if rendered.endswith('$'):
                                rendered = rendered[:-1] + '^{' + em.group(1) + '}$'
                            else:
                                rendered += '^{' + em.group(1) + '}'
                            end += em.end()
                        result.append(rendered)
                        i = end
                        made = True
                        continue
                result.append(text[i])
                i += 1
            text = ''.join(result)
        if not made:
            break
    return text


# ---------------------------------------------------------------------------
# Summations
# Upper bound restricted to math-like starts (n/k/m/digit); single-digit lower.
# ---------------------------------------------------------------------------

def fix_summations(text):
    def sub(m):
        upper = m.group(1)
        lower = m.group(2)
        body  = m.group(3).strip()
        result = r'$\sum_{' + lower + '}^{' + upper + '}$'
        if body:
            result += ' ' + body
        return result
    # Upper bound must start with n/k/m/digit (prevents "thatn" matching)
    # Lower bound uses single digit \d to prevent "i=01" swallowing body tokens
    return re.sub(
        r'(?<![a-zA-Z])([nkm][A-Za-z0-9+\-]{0,8}|\d[A-Za-z0-9+\-]{0,8})'
        r'X\n([a-zA-Z]=\d)(.*?)(?=\n|$)',
        sub,
        text
    )


# ---------------------------------------------------------------------------
# Piecewise notation
# ---------------------------------------------------------------------------

def _bare_frac(text):
    """Quick pass: convert A\nB fraction patterns to \\frac{A}{B} (no $)."""
    rules = [
        (r'n\(n\+1\)\n2(?=[^a-zA-Z]|$)',  r'\\frac{n(n+1)}{2}'),
        (r'k\(k\+1\)\n2(?=[^a-zA-Z]|$)',  r'\\frac{k(k+1)}{2}'),
        (r'(?<![a-zA-Z])1\n2(?=[^a-zA-Z\d]|$)', r'\\frac{1}{2}'),
        (r'(?<![a-zA-Z])1\n4(?=[^a-zA-Z\d]|$)', r'\\frac{1}{4}'),
        (r'n\n2(?=[^a-zA-Z\d]|$)',           r'\\frac{n}{2}'),
        (r'n\n4(?=[^a-zA-Z\d]|$)',           r'\\frac{n}{4}'),
        (r'n\n2k',                            r'\\frac{n}{2^k}'),
        (r'n\+1\n2(?=[^a-zA-Z]|$)',          r'\\frac{n+1}{2}'),
        (r'k\+1\n2(?=[^a-zA-Z]|$)',          r'\\frac{k+1}{2}'),
        (r'p\n2(?=[^a-zA-Z\d]|$)',           r'\\frac{p}{2}'),
    ]
    for pat, rep in rules:
        try:
            text = re.sub(pat, rep, text)
        except Exception:
            pass
    return text


def fix_piecewise(text):
    def build_cases(m):
        body = m.group(1)
        body = _bare_frac(body)          # fix fractions inside before splitting
        lines = [l.strip() for l in body.rstrip().split('\n') if l.strip()]
        # Drop trailing page numbers
        while lines and re.fullmatch(r'\d+', lines[-1]):
            lines.pop()
        # Drop trailing lines that are clearly NOT case branches (no "if"/"otherwise")
        while lines and 'if' not in lines[-1].lower() and 'otherwise' not in lines[-1].lower():
            lines.pop()
        # Join continuation lines (starting with + / * or lacking "if") to previous
        merged = []
        for line in lines:
            if merged and (line.startswith(('+', '*', '/')) or
                           ('if' not in line.lower() and 'otherwise' not in line.lower()
                            and not line[0].isdigit() and not line[0].isupper())):
                merged[-1] += line
            else:
                merged.append(line)
        lines = merged
        if not lines:
            return m.group(0)            # nothing valid - leave as-is
        return r'$$\begin{cases}' + r'\\'.join(lines) + r'\end{cases}$$'

    text = re.sub(
        DIAERESIS + r'\n((?:[^\n]+\n?)+?)(?=\n\n|\Z|(?:[A-Z][a-z]))',
        build_cases,
        text
    )

    def build_pua(m):
        body = m.group(1)
        body = _bare_frac(body)
        lines = [l.strip() for l in body.rstrip().split('\n') if l.strip()]
        while lines and re.fullmatch(r'\d+', lines[-1]):
            lines.pop()
        while lines and 'if' not in lines[-1].lower() and 'otherwise' not in lines[-1].lower():
            lines.pop()
        merged = []
        for line in lines:
            if merged and (line.startswith(('+', '*', '/')) or
                           ('if' not in line.lower() and 'otherwise' not in line.lower()
                            and not line[0].isdigit() and not line[0].isupper())):
                merged[-1] += line
            else:
                merged.append(line)
        lines = merged
        if not lines:
            return m.group(0)
        return r'$$\begin{cases}' + r'\\'.join(lines) + r'\end{cases}$$'

    pua_pat = (
        re.escape(PUA_OPEN) + '[' + re.escape(PUA_FILL) + ']*' +
        re.escape(PUA_MID)  + '[' + re.escape(PUA_FILL) + ']*' +
        re.escape(PUA_CLOSE) + r'((?:[^\n]+\n?)+?)(?=\n\n|\Z)'
    )
    text = re.sub(pua_pat, build_pua, text)
    return text


# ---------------------------------------------------------------------------
# Exponent markers
# ---------------------------------------------------------------------------

def fix_exponent_markers(text):
    return re.sub(
        r'\x01([^\n\x01\x10\x11\x81\x8b\x14\x15\x80\x8a ,;.]+)',
        lambda m: '^{' + m.group(1) + '}',
        text
    )


# ---------------------------------------------------------------------------
# Log subscripts
# ---------------------------------------------------------------------------

def fix_logs(text):
    text = re.sub(r'\blog2(\([^)]+\)|[A-Za-z0-9_]*)', r'$\\log_2 \1$', text)
    text = re.sub(r'\blogb(\([^)]+\)|[A-Za-z0-9_]*)', r'$\\log_b \1$', text)
    return text


# ---------------------------------------------------------------------------
# Plain-newline fractions (emit $\frac{}{}$ directly)
# ---------------------------------------------------------------------------

_M = MINUS

_UNICODE_MINUS_FRACS = [
    (r'n' + _M + r'1\n2(?=[^a-zA-Z]|$)',             r'$\\frac{n-1}{2}$'),
    (r'k' + _M + r'1\n2(?=[^a-zA-Z]|$)',             r'$\\frac{k-1}{2}$'),
    (r'rn\+1' + _M + r'1\nr' + _M + r'1',           r'$\\frac{r^{n+1}-1}{r-1}$'),
    (r'rk\+1' + _M + r'1\nr' + _M + r'1',           r'$\\frac{r^{k+1}-1}{r-1}$'),
    (r'r\(k\+1\)\+1' + _M + r'1\nr' + _M + r'1',   r'$\\frac{r^{(k+1)+1}-1}{r-1}$'),
    (r'r0\+1' + _M + r'1\nr' + _M + r'1',           r'$\\frac{r^{0+1}-1}{r-1}$'),
    (r'rk\+1r' + _M + r'1\nr' + _M + r'1',          r'$\\frac{r^{k+1}(r-1)}{r-1}$'),
    (r'r' + _M + r'1\nr' + _M + r'1',                r'$\\frac{r-1}{r-1}$'),
    (r'3k' + _M + r'1\n2(?=[^a-zA-Z]|$)',            r'$\\frac{3^k-1}{2}$'),
    (r'3n' + _M + r'1\n2(?=[^a-zA-Z]|$)',            r'$\\frac{3^n-1}{2}$'),
]

PLAIN_FRAC_RULES = [
    (r'n\(n\+1\)\n2(?=[^a-zA-Z]|$)',             r'$\\frac{n(n+1)}{2}$'),
    (r'k\(k\+1\)\n2(?=[^a-zA-Z]|$)',             r'$\\frac{k(k+1)}{2}$'),
    (r'\(k\+1\)\(k\+2\)\n2(?=[^a-zA-Z]|$)',      r'$\\frac{(k+1)(k+2)}{2}$'),
    (r'k\(k\+1\)\+2\(k\+1\)\n2(?=[^a-zA-Z]|$)', r'$\\frac{k(k+1)+2(k+1)}{2}$'),
    (r'(?<![a-zA-Z])1\n2(?=[^a-zA-Z\d]|$)', r'$\\frac{1}{2}$'),
    (r'(?<![a-zA-Z])1\n4(?=[^a-zA-Z\d]|$)', r'$\\frac{1}{4}$'),
    (r'(?<![a-zA-Z])1\n8(?=[^a-zA-Z\d]|$)', r'$\\frac{1}{8}$'),
    (r'(?<![a-zA-Z])1\n2i',                  r'$\\frac{1}{2^i}$'),
    (r'(?<![a-zA-Z])1\n2n',                  r'$\\frac{1}{2^n}$'),
    (r'(?<![a-zA-Z])1\n2k',                  r'$\\frac{1}{2^k}$'),
    (r'(?<![a-zA-Z])1\n([in])(?=[^a-zA-Z\d]|$)', r'$\\frac{1}{\1}$'),
    (r'(?<![a-zA-Z])1\n(\d+)(?=[^a-zA-Z]|$)',    r'$\\frac{1}{\1}$'),
    (r'\bn\n2(?=[^a-zA-Z\d]|$)', r'$\\frac{n}{2}$'),
    (r'\bn\n4(?=[^a-zA-Z\d]|$)', r'$\\frac{n}{4}$'),
    (r'\bn\n2k',  r'$\\frac{n}{2^k}$'),
    (r'\bp\n2(?=[^a-zA-Z\d]|$)', r'$\\frac{p}{2}$'),
    (r'\bn\+1\n2(?=[^a-zA-Z]|$)', r'$\\frac{n+1}{2}$'),
    (r'\bk\+1\n2(?=[^a-zA-Z]|$)', r'$\\frac{k+1}{2}$'),
    (r'\bn-1\n2(?=[^a-zA-Z]|$)', r'$\\frac{n-1}{2}$'),
    (r'\bk-1\n2(?=[^a-zA-Z]|$)', r'$\\frac{k-1}{2}$'),
    (r'rn\+1-1\nr-1',            r'$\\frac{r^{n+1}-1}{r-1}$'),
    (r'rk\+1-1\nr-1',            r'$\\frac{r^{k+1}-1}{r-1}$'),
    (r'r\(k\+1\)\+1-1\nr-1',    r'$\\frac{r^{(k+1)+1}-1}{r-1}$'),
    (r'r0\+1-1\nr-1',            r'$\\frac{r^{0+1}-1}{r-1}$'),
    (r'rk\+1r-1\nr-1',           r'$\\frac{r^{k+1}(r-1)}{r-1}$'),
    (r'r-1\nr-1',                 r'$\\frac{r-1}{r-1}$'),
    (r'3k-1\n2(?=[^a-zA-Z]|$)', r'$\\frac{3^k-1}{2}$'),
    (r'3n-1\n2(?=[^a-zA-Z]|$)', r'$\\frac{3^n-1}{2}$'),
    (r'3n2\n22(?=[^a-zA-Z]|$)',   r'$\\frac{3n^2}{2^2}$'),
    (r'32n2\n42(?=[^a-zA-Z]|$)',  r'$\\frac{3^2n^2}{4^2}$'),
    (r'3n\n22(?=[^a-zA-Z]|$)',    r'$\\frac{3n}{2^2}$'),
    (r'b n\n2(?=[^a-zA-Z\d]|$)', r'b$\\frac{n}{2}$'),
    (r'c n\n2(?=[^a-zA-Z\d]|$)', r'c$\\frac{n}{2}$'),
    (r'n\+1Z\n1', r'$\\int_1^{n+1}$'),
    (r'nZ\n1',    r'$\\int_1^n$'),
]


def fix_plain_fracs(text):
    for pattern, repl in _UNICODE_MINUS_FRACS + PLAIN_FRAC_RULES:
        try:
            text = re.sub(pattern, repl, text)
        except Exception:
            pass
    return text


# ---------------------------------------------------------------------------
# Superscripts -- only applied OUTSIDE $...$ blocks
# ---------------------------------------------------------------------------

SUPERSCRIPT_RULES = [
    (r'\br2\b',    r'r^2'),
    (r'\br3\b',    r'r^3'),
    (r'\brn\b(?=[^a-zA-Z])', r'r^n'),
    (r'\brk\b(?=[^a-zA-Z])', r'r^k'),
    (r'\br0\b',    r'r^0'),
    (r'\brn\+1\b', r'r^{n+1}'),
    (r'\brk\+1\b', r'r^{k+1}'),
    (r'\br\(k\+1\)\+1\b', r'r^{(k+1)+1}'),
    (r'\b20\+1\b',  r'2^{0+1}'),
    (r'\b2n\+1\b',  r'2^{n+1}'),
    (r'\b2k\+1\b',  r'2^{k+1}'),
    (r'\b2\(k\+1\)\+1\b', r'2^{(k+1)+1}'),
    (r'\b20\b(?=[^a-zA-Z\d])',  r'2^0'),
    (r'\b2n\b(?=[^a-zA-Z\d])',  r'2^n'),
    (r'\b2k\b(?=[^a-zA-Z\d])',  r'2^k'),
    (r'\b3n\b(?=[^a-zA-Z\d])',  r'3^n'),
    (r'\b3k\b(?=[^a-zA-Z\d])',  r'3^k'),
    (r'\b3n\+1\b',  r'3^{n+1}'),
    (r'\b3k\+1\b',  r'3^{k+1}'),
    (r'\bn2\b(?=[+\-*/=,. \n\)])', r'n^2'),
    (r'\bn3\b(?=[+\-*/=,. \n\)])', r'n^3'),
    (r'\bn4\b(?=[+\-*/=,. \n\)])', r'n^4'),
    (r'\bp2\b(?=[+\-*/=,. \n\)])', r'p^2'),
    (r'\balogb\(n\)',   r'a^{\\log_b(n)}'),
    (r'\bnlogb\(a\)',   r'n^{\\log_b(a)}'),
    (r'\bblogb\(a\)',   r'b^{\\log_b(a)}'),
    (r'\bblogb\(n\)',   r'b^{\\log_b(n)}'),
    (r'\bxp1p2\b', r'x^{p_1 p_2}'),
    (r'\bxp1\b',   r'x^{p_1}'),
    (r'\bxp2\b',   r'x^{p_2}'),
    (r'\bpn\b(?=[+\-*/=,. \n]|$)', r'\\sqrt{n}'),
]


def fix_superscripts(text):
    return _apply_outside_math(text, SUPERSCRIPT_RULES)


# ---------------------------------------------------------------------------
# Cleanup
# ---------------------------------------------------------------------------

def cleanup(text):
    text = re.sub(r'\n\d{1,2}\n*$', '', text.rstrip())

    text = re.sub(
        re.escape(FLOOR_L) + r'([^' + re.escape(FLOOR_R) + r']+)' + re.escape(FLOOR_R),
        lambda m: r'$\lfloor ' + m.group(1).strip() + r' \rfloor$',
        text
    )

    text = re.sub(r'r' + NOT_EQ_COMB + r'=(\S*)', r'r $\\neq$ \1', text)

    text = text.replace('\x01', '')
    for c in '\x95\x98\x12\x13':
        text = text.replace(c, '')

    text = re.sub(r'[\x00-\x08\x0b-\x1f\x7f-\x9f]', '', text)

    for c in PUA_MATRIX + PUA_OPEN + PUA_MID + PUA_CLOSE + PUA_FILL:
        text = text.replace(c, '')

    return text


# ---------------------------------------------------------------------------
# Pipeline
# ---------------------------------------------------------------------------

BRACKET_PAIRS = [
    ('\x10', '\x11', '(', ')'),
    ('\x14', '\x15', '[', ']'),
    ('\x81', '\x8b', '(', ')'),
    ('\x80', '\x8a', '(', ')'),
]


def transform(text):
    if not text or text == 'unavailable':
        return text
    text = process_brackets(text, BRACKET_PAIRS)
    text = fix_exponent_markers(text)
    text = fix_summations(text)
    text = fix_piecewise(text)
    text = fix_logs(text)
    text = fix_plain_fracs(text)
    text = fix_superscripts(text)
    text = cleanup(text)
    return text


def main():
    path = (r'c:\Users\bittu\Desktop\ld\2004-final-exam'
            r'\quest\data\game_data.js')
    with open(path, 'r', encoding='utf-8') as f:
        raw = f.read()
    prefix = 'window.GAME_DATA = '
    suffix = ';\n'
    data = json.loads(raw[len(prefix):-len(suffix)])
    changed = 0
    for q in data['questions']:
        for field in ('problem', 'solution'):
            orig = q.get(field, '')
            fixed = transform(orig)
            if fixed != orig:
                q[field] = fixed
                changed += 1
    out = (prefix
           + json.dumps(data, ensure_ascii=False, separators=(',', ':'))
           + suffix)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(out)
    print(f'Done -- {changed} fields updated.', file=sys.stderr)


if __name__ == '__main__':
    main()
