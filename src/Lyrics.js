import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom"
const cio = require('cheerio-without-node-native');


export function Lyrics(props) {
    let { path } = useParams()
    let [data, setData] = useState({})
    useEffect(() => {
    fetch('https://thingproxy.freeboard.io/fetch/' + "https://genius.com/" + path, { mode: 'cors' })
        .then(response => (response.text()))
        .then((html) =>{ setData(html)})
    }, []
    )
    const $ = cio.load(data);
    let lyrics = $('div[class="lyrics"]').text().trim();
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
    return <div dangerouslySetInnerHTML={{ __html: lyrics.trim().replace(/(?:\r\n|\r|\n)/g, '<br>') }} />
}

