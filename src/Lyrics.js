import { useEffect, useState } from 'react';
const cio = require('cheerio-without-node-native');

export function Lyrics(props) {
    let [data, setData] = useState({})
    useEffect(() => fetch('https://thingproxy.freeboard.io/fetch/' + props.url, { mode: 'cors' })
        .then(response => (response.text()))
        .then((html) =>{ setData(html)})
        , [props.url]
    )
    const $ = cio.load(data);
    let lyrics = $('div[class   ="lyrics"]').text().trim();
    if (!lyrics) {
        lyrics = ''
        $('div[class^="Lyrics__Container"]').each((i, elem) => {
            if ($(elem).text().length !== 0) {
                let snippet = $(elem).html()
                    .replace(/<br>/g, '\n')
                    .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
                lyrics += $('<textarea/>').html(snippet).text().trim() + '\n\n';
            }
        })
    }
    if (!lyrics) return null;
    return <p>{lyrics.trim()}</p>
}
