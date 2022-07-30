import './App.css';
import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Lyrics } from './Lyrics';

export default function App() {
  return (
    <div>
      <Header />
      <Search />
      <Lyrics  url="https://genius.com/Taylor-swift-exile-lyrics"/>
    </div>
  );
}

function Header() {
  return (
    <>
      <div id="header">
        <div id="hContent">
          Website Title
        </div>
      </div>
      <br />
      <Container className='w-100' fluid="md">
        <Row>
          <Col>Brief Description</Col>
        </Row>
      </Container>
    </>
  )
}
function Search() {
  const [searched, setSearched] = useState({ name: "Taylor Swift" });
  const [artistName, setArtistName] = useState([]);
  const onChangeHandler = (event) => {
    var newValue = event.target.value;
    var targetName = event.target.name;
    setSearched({ ...searched, [targetName]: newValue });
  }
  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'cf9c36239bmsh101292c4053037fp1cd164jsn32e552991d7b',
        'X-RapidAPI-Host': 'genius.p.rapidapi.com'
      }
    };
    fetch('https://genius.p.rapidapi.com/search?q=' + searched.name, options)
      .then(response => response.json())
      .then(response => {
        const artistID = response.response.hits[0].result.primary_artist.id;
        return fetch('https://genius.p.rapidapi.com/artists/' + artistID + '/songs?per_page=5&page=1&sort=popularity', options);
      })
      .then(response => response.json())
      .then(response => {console.log(response)
         setArtistName(response) })
      .catch(err => console.error(err));
  }, [searched]);

  let storeSongs = () => {

      let songList = [];
      for (let i = 0; i < artistName.response.songs.length; i++) {
        songList.push({
          coverArt: artistName.response.songs[i].header_image_url,
          title: artistName.response.songs[i].title,
          release: artistName.response.songs[i].release_date_for_display
        }
        )
      }
      return songList;
    
  }
  return (
    <>
      <input type="text" name={"name"} placeholder='Search for an artist' onChange={onChangeHandler} value={searched.name}></input>
      <SearchedArtist name={searched.name} />
      <Container className='songContainer w-100'>
        {artistName.response && storeSongs().map((songsinfo) => {
          return (
            <ArtistForm coverArt={songsinfo.coverArt} title={songsinfo.title} release={songsinfo.release} />)}
        )}
        </Container>
    </>
  )
}

function SearchedArtist(props) {
  return (
    <h1>
      {props.name}
    </h1>
  )
}



function ArtistForm(props) {
  return (
    <Row className='songs'>
      <Col><img src={props.coverArt} alt="Artist Song Cover Art" /></Col>
      <Col>{props.title}</Col>
      <Col>{props.release}</Col>
    </Row>
  )
}

