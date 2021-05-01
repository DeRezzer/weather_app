/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import fetch from 'isomorphic-unfetch';
import dateFormat from 'dateformat';

import { css } from '@emotion/react';

import Spinner from './components/spinner';



//component for the date
function WDate(props){

  const weirdTime = props.date;

  // let saneTime = new Date(0);
  //
  // saneTime.setUTCSeconds(weirdTime);
  //console.log("== result of weirdTime var", weirdTime);
  //let uts = props.date;

  const date = new Date(weirdTime*1000);
  const formattedDate = dateFormat(date, "ddd mmm d h:MM:ss TT Z");

  console.log(" == this is our time object: ", formattedDate);

  const styles = css `
      background-color: lavenderblush;
      color: mediumvioletred;
      margin: 0;
      padding: 10px;
  `;

    return (
        <div>
            <h1 css={styles}>Date: {formattedDate}</h1>
        </div>
    );
}

//<Temp temp={data}/>

//component for temperatures
function Temp(props){
    return (
        <div>
            <h2>Temp: {props.temp.temp} {"\xB0"}F</h2>
            <h2>Feels Like: {props.temp.feels_like} {"\xB0"}F</h2>
            <h2>Min: {props.temp.temp_min} {"\xB0"}F</h2>
            <h2>Max: {props.temp.temp_max} {"\xB0"}F</h2>
        </div>
    );
}

//component for probability of precipitation
function Pop(props){
    return (
        <div>
            <h3>Probability of precipitation: {Math.trunc(props.pop*100)}%</h3>
        </div>
    );
}

//component for weather description and associated icon
function Description(props){

  const styles = css `

    display: block;
    margin-left: auto;
    margin-right: auto;
  `;

    return (
        <div>
            <h3>Description: {props.description.description}</h3>
          <div>
            <img css={styles} alt={"whut"} src={"https://openweathermap.org/img/wn/" + props.description.icon + "@2x.png"} />
          </div>
        </div>
    );
}


//main card component for: Date Temp Pop and Description components
function Card(props){

  const styles = css `
    position: relative;
    background-color: lightgrey;
    justify-content: center;
  `;

    return (
        <div css={styles}>
            <WDate date={props.time}/>
            <Temp temp={props.temperature}/>
            <Pop pop={props.prec}/>
            <Description description={props.desc}/>
        </div>
    )
}

/* the card for each 3 hour weather update should look something like this..... I HOPE!! xD
<Card
    time={data.dt_txt}
    temperature={data.main}
    prec={data.pop}
    desc={data.weather[0]}
/>
*/

function FetchForcast({query}){
    const [ inputQuery, setInputQuery ] = useState(query || "");
    const [ forcasts, setForcasts ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const history = useHistory();

    const styles = css `
      list-style: none;
      display: flex;
      width: 500px;
    `;

    const container = css `
      width: 100%;
      overflow: hidden;
      overflow-x: scroll
    `;

    const containerItem = css `
      min-width: 360px;
      padding: 10px;
    `;


    const navBar = css  `
      color: blue;
      text-align: center;
    `;

    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();
        async function weather(){
            let responseBody = {};
            setIsLoading(true);
            try {
                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?q=${inputQuery}&appid=bfb15fd71078ef4d76b0d6f45ac18275&units=imperial`,
                    { signal: controller.signal }
                );
                responseBody = await res.json();
            } catch (e) {
                if (e instanceof DOMException){
                    console.log("HTTP request aborted!");
                } else {
                    throw e;
                }
            }

            if (!ignore){
                setForcasts(responseBody.list || []);
                setIsLoading(false);
                console.log("== Forcasts: ", responseBody.list);
            }
        }
        weather();
        return () => {
            controller.abort();
            ignore = true;
        };
    }, [ query ]);

    return(
        <div>
          <div css={navBar}>
            <form onSubmit={(e) => {
                e.preventDefault();
                history.push(`?q=${inputQuery}`);
            }}>
                <input placeholder="Enter city" value={inputQuery} onChange={e => setInputQuery(e.target.value)}/>
                <button type="submit">Search City</button>
            </form>
            <h2>Displaying Weather for: {query}</h2>
          </div>
            { isLoading ? (
                <Spinner />
            ): (
              <div css={container}>
                <ul css={styles}>
                {forcasts.map(data => (
                    <li css={containerItem} key={data.dt}>
                        <Card
                            time={data.dt}
                            temperature={data.main}
                            prec={data.pop}
                            desc={data.weather[0]}
                        />
                    </li>
                    ))}
                </ul>
              </div>
            )}
        </div>
    );
}

export default FetchForcast;
