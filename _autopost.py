# Converts all Markdown files to a HTML blog!
import re, os, markdown, datetime as dt, textwrap as tw
from bs4 import BeautifulSoup, NavigableString

TW_WIDTH_LIMIT = 200
md2html = lambda c: markdown.markdown(c, extensions=[
    'tables',
    'fenced_code',
    'pymdownx.smartsymbols',
    'pymdownx.tilde',
    'pymdownx.emoji',
    'pymdownx.highlight',
    'pymdownx.inlinehilite'
])

html_content = open(os.path.join('posts', 'index.html')).read()
template_content = open(os.path.join('posts', '_template.html')).read()
soup = BeautifulSoup(html_content, 'html.parser')
posts_container = soup.find('div', id='posts-container')
posts_container.clear()
posts = []

for path, dirs, files in os.walk('markdown'):
    for file in files:
        if file.endswith('.md'):
            markdown_content = open(os.path.join(path, file), encoding='utf-8').read().replace('../posts/media', 'media').replace('align*', 'align\*').replace('\\'*2, '\\'*3).replace('\\left\\{', '\\left\\\\{').replace('\\right\\}', '\\right\\\\}')
            md2html_content = md2html(markdown_content)
            md_soup = BeautifulSoup(md2html_content, 'html.parser')

            for ul in md_soup.find_all('ul'):
                nxt = ul.find_next_sibling()
                if nxt and nxt.name == 'ul':
                    for li in nxt.find_all('li'):
                        ul.append(li)
                    nxt.decompose()

            first_p = md_soup.find('p')
            first_h1 = md_soup.find('h1')

            date = dt.datetime.strptime(first_p.text, '%d %B %Y')
            new_tag = md_soup.new_tag("div")
            new_tag["class"] = "date"
            first_p.wrap(new_tag)

            # style issue
            for h in md_soup.findAll('h4'): h.name = 'h5'
            for h in md_soup.findAll('h3'): h.name = 'h4'
            for h in md_soup.findAll('h2'): h.name = 'h3'
            for h in md_soup.findAll('h1'): h.name = 'h2'

            # rebuild nav
            headers = md_soup.find_all(['h2', 'h3', 'h4'])
            nav_ul = BeautifulSoup('<ul></ul>', 'html.parser').ul
            nav_ul.append(BeautifulSoup('<li><a class="active" href="index.html">Back to all write-ups</a></li>', 'html.parser'))
            nav_ul.append(md_soup.new_tag('br'))
            for h in headers:
                anchor = re.sub(r'[^a-zA-Z0-9]+', '-', h.text).strip('-').lower()
                h['id'] = anchor
                li = md_soup.new_tag('li')
                a = md_soup.new_tag('a', href=f'#{anchor}')
                a.string = tw.shorten(h.text, width=25, placeholder='...')
                if h.name == 'h3': a['style'] = 'font-size: 0.95em; font-weight: 500;'
                elif h.name == 'h4': a['style'] = 'font-size: 0.85em; font-weight: 400;'
                elif h.name == 'h5': a['style'] = 'font-size: 0.75em; font-weight: 300;'
                li.append(a)
                nav_ul.append(li)
            nav_tag = md_soup.new_tag('nav', id='nav')
            nav_tag.append(nav_ul)

            html_fn = 'posts/'+file[1:][:-3]+'.html'
            posts.append((date, first_h1.text, first_p.text, html_fn.split('/')[-1], '\n'.join(p.text for p in md_soup.findAll('p')[1:])))

            template_soup = BeautifulSoup(template_content, 'html.parser')
            template_title = template_soup.find('title')
            template_title.insert(0, NavigableString(first_h1.text))
            post_container = template_soup.find('div', {'class': 'post-container'})
            existing_nav = template_soup.find('nav', id='nav')
            if existing_nav: existing_nav.replace_with(nav_tag)
            else: post_container.insert_before(nav_tag)
            post_container.insert(0, md_soup)

            with open(html_fn, 'w+', encoding='utf-8') as f:
                f.write(str(template_soup))

for date, title, date_text, html_fn, md_soup_p in sorted(posts, reverse=True):
    if html_fn.startswith('_'): continue
    print([date_text, title, html_fn])
    summary = tw.shorten(md_soup_p, width=TW_WIDTH_LIMIT, placeholder='...')
    new_article = soup.new_tag("article")
    new_a = soup.new_tag("a")
    new_a['href'] = html_fn
    new_div = soup.new_tag('div')
    new_p = soup.new_tag('p')
    new_p2 = soup.new_tag('p')
    new_h4 = soup.new_tag('h4')
    new_a.insert(0, NavigableString(title))
    new_p.insert(0, NavigableString(date_text))
    new_p2.insert(0, NavigableString(summary))
    new_h4.append(new_a)
    new_div.append(new_p)
    new_div.append(new_p2)
    new_article.append(new_h4)
    new_article.append(new_div)
    posts_container.append(new_article)

with open(os.path.join('posts', 'index.html'), 'w+') as f:
    f.write(soup.prettify())
    f.close()

