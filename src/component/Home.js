import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import crossfilter from 'crossfilter2'
import Tabledc from './Tabledc'

function Home(){
    const [cx, setCx] = useState(null);

    const  dateFormatSpecifier = '%m/%d/%Y';
    const dateFormat = d3.timeFormat(dateFormatSpecifier);
    const dateFormatParser = d3.timeParse(dateFormatSpecifier);
    const numberFormat = d3.format('.2f');

    const loadCsData = async () =>{
        //console.log("function called")
        d3.csv('./examples.csv')
        .then((data)=> {
            data.forEach(function (d) {

            });
            let ndx = crossfilter(data); //TODO possibly need to update this
            setCx(ndx);
        })
    }

    useEffect(()=>{
        async function asyncLoadCsData(){
            await loadCsData();
        };
        asyncLoadCsData();
    },[]);
    if(!cx){
        return (
            <>
            <div className="text-center">
                <div className="spinner-grow text-primary" role="status"></div>
            </div>
            </>
        );

    }

    // console.log(cx)

    return(
        <>
        <Tabledc ndx={cx}/>
        </>
    )
}
export default Home;