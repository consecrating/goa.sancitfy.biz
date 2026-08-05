#!/usr/bin/env python3
"""Swap ONLY the nav/logo/favicon/footer of a legacy Bootstrap page with the
new isolated 'gdc' chrome. The page body content is left completely intact."""
import sys, re

V = "26"  # cache-bust for logo

FAVICON_OLD = '<link rel="shortcut icon" type="image/x-icon" href="https://www.goa.sanctify.in/images/favicon.png">'
FAVICON_NEW = (
'<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">\n'
'<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16.png">\n'
'<link rel="icon" href="/assets/favicon.ico" sizes="any">\n'
'<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">\n'
'<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n'
'<link rel="stylesheet" href="/assets/chrome.css?v=2">'
)

HEADER = '''<!-- gdc chrome: header -->
<header class="gdc-header">
  <div class="gdc-in">
    <a href="/" class="gdc-brand"><img src="/assets/logo.png?v=%(V)s" alt="Goa Directory logo"><span><b>Goa Directory</b><small>SANCTIFY \u00b7 SINCE 2012</small></span></a>
    <nav class="gdc-nav"><a href="/">Home</a><a href="/#categories">Categories</a><a href="/#featured">Featured</a><a href="/#areas">Areas</a><a href="/about">About</a><a href="/contact">Contact</a></nav>
    <div class="gdc-cta">
      <a class="gdc-btn gdc-wa" href="https://wa.me/919923352923" aria-label="Chat on WhatsApp"><svg class="gdc-ic"><use href="/assets/sprite.svg#b-whatsapp"/></svg> WhatsApp</a>
      <a class="gdc-btn gdc-ghost" href="tel:9923352923"><svg class="gdc-ic"><use href="/assets/sprite.svg#i-phone"/></svg> 99233 52923</a>
    </div>
    <button class="gdc-menu" type="button" aria-label="Open menu" onclick="gdcOpen()"><svg class="gdc-ic"><use href="/assets/sprite.svg#i-menu"/></svg></button>
  </div>
</header>
<div class="gdc-overlay" onclick="gdcClose()"></div>
<nav class="gdc-drawer" aria-label="Mobile menu">
  <div class="gdc-dhead"><img src="/assets/logo.png?v=%(V)s" alt=""> Goa Directory
    <button class="gdc-dclose" type="button" aria-label="Close menu" onclick="gdcClose()"><svg class="gdc-ic"><use href="/assets/sprite.svg#i-x"/></svg></button>
  </div>
  <a class="gdc-dlink" href="/">Home</a>
  <a class="gdc-dlink" href="/#categories">Categories</a>
  <a class="gdc-dlink" href="/#featured">Featured</a>
  <a class="gdc-dlink" href="/#areas">Areas</a>
  <a class="gdc-dlink" href="/about">About</a>
  <a class="gdc-dlink" href="/contact">Contact</a>
  <div class="gdc-dfoot">
    <h5>Get in touch</h5>
    <a class="gdc-di" href="tel:9923352923"><svg class="gdc-ic"><use href="/assets/sprite.svg#i-phone"/></svg> +91 99233 52923</a>
    <a class="gdc-di" href="mailto:help@sanctify.in"><svg class="gdc-ic"><use href="/assets/sprite.svg#i-mail"/></svg> help@sanctify.in</a>
    <div class="gdc-dsoc">
      <a href="https://www.facebook.com/sanctifygoa" aria-label="Facebook"><svg class="gdc-ic"><use href="/assets/sprite.svg#b-facebook"/></svg></a>
      <a href="https://www.instagram.com/sanctifygoa" aria-label="Instagram"><svg class="gdc-ic"><use href="/assets/sprite.svg#b-instagram"/></svg></a>
      <a href="https://www.linkedin.com/company/sanctify" aria-label="LinkedIn"><svg class="gdc-ic"><use href="/assets/sprite.svg#b-linkedin"/></svg></a>
      <a href="https://wa.me/919923352923" aria-label="WhatsApp"><svg class="gdc-ic"><use href="/assets/sprite.svg#b-whatsapp"/></svg></a>
    </div>
    <a class="gdc-dcall" href="tel:9923352923"><svg class="gdc-ic"><use href="/assets/sprite.svg#i-phone"/></svg> Call +91 99233 52923</a>
  </div>
</nav>
''' % {"V": V}

FOOTER = '''<!-- gdc chrome: footer -->
<footer class="gdc-footer">
  <div class="gdc-fin">
    <div class="gdc-fcols">
      <div class="gdc-fcol gdc-fabout">
        <div class="gdc-fbrand"><img src="/assets/logo.png?v=%(V)s" alt="Goa Directory logo"> Goa Directory</div>
        <p>Goa's #1 local business directory \u2014 powered by SANCTIFY. Helping people discover trusted businesses across Goa since 2012.</p>
        <div class="gdc-soc">
          <a href="https://www.facebook.com/sanctifygoa" aria-label="Facebook"><svg class="gdc-ic"><use href="/assets/sprite.svg#b-facebook"/></svg></a>
          <a href="https://www.instagram.com/sanctifygoa" aria-label="Instagram"><svg class="gdc-ic"><use href="/assets/sprite.svg#b-instagram"/></svg></a>
          <a href="https://www.linkedin.com/company/sanctify" aria-label="LinkedIn"><svg class="gdc-ic"><use href="/assets/sprite.svg#b-linkedin"/></svg></a>
          <a href="https://www.youtube.com/c/SanctifyGoa" aria-label="YouTube"><svg class="gdc-ic"><use href="/assets/sprite.svg#b-youtube"/></svg></a>
          <a href="https://wa.me/919923352923" aria-label="WhatsApp"><svg class="gdc-ic"><use href="/assets/sprite.svg#b-whatsapp"/></svg></a>
        </div>
      </div>
      <div class="gdc-fcol">
        <h4>Top Categories</h4>
        <a href="/categories/accommodation-goa">Hotels &amp; Resorts</a>
        <a href="/categories/food-dining-goa">Restaurants &amp; Caf\u00e9s</a>
        <a href="/categories/spa-salon-goa">Salons &amp; Spa</a>
        <a href="/categories/home-office-interior-goa">Interior Decorators</a>
        <a href="/categories/marketing-agency-goa">Marketing Agencies</a>
        <a href="/categories/electronics-goa">Electronics</a>
      </div>
      <div class="gdc-fcol">
        <h4>Popular Areas</h4>
        <a href="/#areas">Vasco da Gama</a>
        <a href="/#areas">Margao</a>
        <a href="/#areas">Panaji</a>
        <a href="/#areas">Candolim</a>
        <a href="/#areas">Mapusa</a>
        <a href="/#areas">Ponda</a>
      </div>
      <div class="gdc-fcol">
        <h4>Company</h4>
        <a href="/about">About Us</a>
        <a href="/contact">Contact</a>
        <a href="/#list">Add Your Business</a>
        <a href="https://blog.goa.guru/">Blog</a>
        <a href="/sitemap.xml">Sitemap</a>
      </div>
      <div class="gdc-fcol">
        <h4>Get in touch</h4>
        <div class="gdc-fcontact">
          <a href="tel:9923352923"><svg class="gdc-ic"><use href="/assets/sprite.svg#i-phone"/></svg> +91 99233 52923</a>
          <a href="https://wa.me/919923352923"><svg class="gdc-ic"><use href="/assets/sprite.svg#b-whatsapp"/></svg> WhatsApp Chat</a>
          <a href="mailto:help@sanctify.in"><svg class="gdc-ic"><use href="/assets/sprite.svg#i-mail"/></svg> help@sanctify.in</a>
          <span><svg class="gdc-ic"><use href="/assets/sprite.svg#i-map-pin"/></svg> Zuarinagar, Vasco, Goa 403726</span>
        </div>
      </div>
    </div>
    <div class="gdc-fbot">
      <span>\u00a9 Copyright 2012 - <script>document.write(new Date().getFullYear())</script> . All rights reserved</span>
      <nav class="gdc-fbot-links"><a href="/">Privacy Policy</a><a href="/">Terms of Use</a><a href="/sitemap.xml">Sitemap</a></nav>
      <span>Powered by&nbsp;&nbsp;<a href="https://www.sanctify.in/" class="gdc-pw" title="Best Digital Marketing Agency in Goa">SANCTIFY</a></span>
    </div>
  </div>
</footer>''' % {"V": V}

SCRIPT = '''<script>
(function(){var d=document.querySelector('.gdc-drawer'),o=document.querySelector('.gdc-overlay');if(!d)return;
window.gdcOpen=function(){d.classList.add('open');o.classList.add('open');document.body.style.overflow='hidden';};
window.gdcClose=function(){d.classList.remove('open');o.classList.remove('open');document.body.style.overflow='';};
o.addEventListener('click',window.gdcClose);
Array.prototype.forEach.call(d.querySelectorAll('a'),function(a){a.addEventListener('click',window.gdcClose);});
document.addEventListener('keydown',function(e){if(e.key==='Escape')window.gdcClose();});
requestAnimationFrame(function(){requestAnimationFrame(function(){document.documentElement.classList.add('gdc-ready');});});})();
</script>'''

DIV_RE = re.compile(r'<(/?)div\b', re.I)

def matching_div_end(html, start):
    """Return index just past the </div> that closes the <div> at `start`."""
    depth = 0
    for m in DIV_RE.finditer(html, start):
        if m.group(1) == '':
            depth += 1
        else:
            depth -= 1
            if depth == 0:
                return html.find('>', m.end()) + 1
    return -1

def apply(path, header_start='<div id="logo-header"',
          footer_start='<footer class="site-footer footer-map">'):
    with open(path, encoding='utf-8') as f:
        html = f.read()
    orig_len = len(html)
    # 1) favicon + assets — match the legacy shortcut-icon link on any domain
    new_html, n = re.subn(r'<link rel="shortcut icon"[^>]*>', lambda m: FAVICON_NEW, html, count=1)
    if n:
        html = new_html
    else:
        html = html.replace('</head>', FAVICON_NEW + '\n</head>', 1)
    # 2) header block (matched-div extraction, robust to what follows)
    i0 = html.find(header_start)
    assert i0 != -1, "header start not found in %s" % path
    i1 = matching_div_end(html, i0)
    assert i1 != -1, "could not close header div in %s" % path
    html = html[:i0] + HEADER + html[i1:]
    # 3) footer block
    f0 = html.find(footer_start)
    assert f0 != -1, "footer start not found in %s" % path
    f1 = html.find('</footer>', f0) + len('</footer>')
    html = html[:f0] + FOOTER + html[f1:]
    # 4) drawer script
    assert '</body>' in html, "no </body> in %s" % path
    html = html.replace('</body>', SCRIPT + '\n</body>', 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print("OK %s : %d -> %d bytes" % (path, orig_len, len(html)))

if __name__ == '__main__':
    for t in (sys.argv[1:] or ['about.html']):
        apply(t)
