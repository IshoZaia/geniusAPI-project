import './App.scss';
import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Lyrics } from './Lyrics';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Song from './Song';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import logo from "./Genius Logo.png"
export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="lyrics" element={<Lyrics url=""/>}/>
        <Route path="song/:id" element={<Song />} />
      </Routes>
    </BrowserRouter>
  );
}

function Header() {
  return (
    <Navbar bg={"dark"} variant={"dark"}>
      <Container>
        <Navbar.Brand>
          <LinkContainer to={'/'}>
            <img
              src={logo}
              width='50px' alt="Genius Logo"/>
          </LinkContainer> {" "}
          Top 5's
        </Navbar.Brand>
        <Navbar.Brand href="https://rapidapi.com/brianiswu/api/genius/">Powered by Genius API</Navbar.Brand>
      </Container>
    </Navbar>
  )
}
function Search() {
  const [searched, setSearched] = useState({ name: "" });
  const [artistName, setArtistName] = useState([]);
  const [counter, setCounter] = useState(1);
  const [artistID, setArtistID] = useState({ id: ""});
  
  const onChangeHandler = (event) => {
    var newValue = event.target.value;
    var targetName = event.target.name;
    setSearched({ ...searched, [targetName]: newValue });
  }
  const nextPage = (event) => {
    setCounter(counter + 1);
  }
  const prevPage = (event) => {
      setCounter(counter <= 1 ? 1 : counter - 1);
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
        return fetch('https://genius.p.rapidapi.com/artists/' + artistID + '/songs?per_page=5&page=' + counter + '&sort=popularity', options);
      })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        setArtistName(response)
        setArtistID(response.response.songs[0].id)
      })
      .catch(err => console.error(err));
  }, [searched, counter]);

  let storeSongs = () => {

    let songList = [];
    for (let i = 0; i < artistName.response.songs.length; i++) {
      songList.push({
        id: artistName.response.songs[i].id,
        coverArt: artistName.response.songs[i].header_image_url,
        title: artistName.response.songs[i].title,
        release: artistName.response.songs[i].release_date_for_display,
        lyrics: artistName.response.songs[i].url
      }
      )
    }
    return songList;
  }

  if (artistName.response === undefined){
    return (
      <>
      <Container className='w-100' fluid="md">
        <Row>
          <Col id="desc"><h2>Search for any artist to reveal their top 5 songs! </h2></Col>
        </Row>
      </Container>
      <div className="text-center" >
        <input type="text" name={"name"} id="search" placeholder='Search for an artist' onChange={onChangeHandler} value={searched.name}></input>
      </div>
      <SearchedArtist name={searched.name} />
      <Row>
          <Col id="desc"><h4>Made By: Mike, Rodel &amp; Isho</h4></Col>
        </Row>
      </>
    )
  }
  return (
    <>
      <Container className='w-100' fluid="md">
        <Row>
          <Col id="desc"><h2>Search for any artist to reveal their top 5 songs! </h2></Col>
        </Row>
      </Container>
      <div className="text-center" >
        <input type="text" name={"name"} id="search" placeholder='Search for an artist' onChange={onChangeHandler} value={searched.name}></input>
      </div>
      <SearchedArtist name={searched.name}/>
      <Container className="d-flex flex-col-md-4 p-10">
        {artistName.response && storeSongs().map((songsinfo) => {
          return (
            <ArtistForm key={songsinfo.id}
              coverArt={songsinfo.coverArt}
              title={songsinfo.title}
              release={songsinfo.release}
              sample={songsinfo.sample}
              songLink={songsinfo.id}
               />)
        }
        )}
      </Container>
      <Container style={{padding: "20px"}} className="text-center">
      <button id="button" className="btn btn-dark" onClick={prevPage}> Last </button> {" "}
      <button id="button" className="btn btn-dark" onClick={nextPage}> Next </button>
      </Container>
    </>
  )
      }
    
function SearchedArtist(props) {
  return (
    <h1 style={{ textAlign: "center", padding: "10px" }}>
      {props.name}
    </h1>
  )
}

function ArtistForm(props) {
  return (
    <Card style={{ width: '18rem'}} className="text-center" key={props.id}>
      <Card.Img variant="top" src={props.coverArt} className="card-img-top" />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item> {props.release}</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Link id="button" className="btn btn-dark" to={`song/${props.songLink}`} >Songs</Link> {" "}
        <Card.Link id="button" className="btn btn-dark" to={"lyrics"}>Lyrics</Card.Link>
      </Card.Body>
    </Card>
  )
}
