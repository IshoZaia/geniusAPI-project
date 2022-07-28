import './App.css';
import {useState, useEffect} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function App() {
  return (
    <div>
      <Header />
      <Search />
    </div>
  );
}

function Header(){
  return(
    <>
    <div id="header">
      <div id="hContent">
        Website Title
    </div>
    </div>
    <br />
    <Container fluid="md">
      <Row>
        <Col>Brief Description</Col>
      </Row>
    </Container>
    </>
  )
}
function Search(){
  const [searched, setSearched] = useState({name:""});
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
  fetch('https://genius.p.rapidapi.com/search?q='+searched.name, options)
    .then(response => response.json())
    .then(response => {
      const artistID = response.response.hits[0].result.primary_artist.id;
      return fetch('https://genius.p.rapidapi.com/artists/'+artistID+'/songs?per_page=5&page=1&sort=popularity', options);
    })
    .then(response => response.json())
    .then(response => setArtistName(response))
    .then(console.log(artistName))
    .catch(err => console.error(err));
}, [searched]);

function renderSongs(){
  const songList = [];
  for(let i = 0; i < 5; i++){
    const coverArt = artistName.songs[i].header_image_url;
    const title = artistName.songs[i].title;
    const release = artistName.songs[i].release_date_for_display;
    songList.push(<ArtistForm
      coverArt={coverArt}
      title={title}
      release={release}
      />)
  }
  return songList;
}
  return(
    <>
    <input type="text" name={"name"} placeholder='Search for an artist' onChange={onChangeHandler} value={searched.name}></input>
    <SearchedArtist
    name={searched.name}/>
    </>
  )
}

function SearchedArtist(props){
  return (
    <h1>
      {props.name}
    </h1>
  )
}



function ArtistForm(props){
  return(
    <table>
    <tr>
     <td> {props.coverArt} </td>
     <td> {props.title} </td>
     <td> {props.release} </td>
    </tr>
    <br /><br />
    </table>
  )
}

