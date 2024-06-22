import React, { useState,useEffect } from "react";
import './Research.css'
const Reasearch = () => {
    const [input, setInput] = useState('');
    const [box1,setBox] = useState('');
    const [residue1,setResidue] = useState('');
    const [price1,setPrice] = useState('');
    // useEffect(() => {
        // const form = document.querySelector('#f1');

        // Add an event listener to the form for the 'submit' event
        // form.addEventListener('submit', function (event) {
            // event.preventDefault(); // Prevent the default form submission

            // Call a function to execute the script
            // handleSubmit();
        // });
        

        // function handleSubmit() {
        //     var inp = parseFloat(document.getElementById("input").value);


        //     var box = document.getElementById("box");
        //     let boxl = 280 * inp;
        //     var boxn = document.createTextNode(boxl);
        //     box.appendChild(boxn);

        //     var residue = document.getElementById("residue");
        //     let residuel = 24 * boxl;
        //     var residuen = document.createTextNode(residuel);
        //     residue.appendChild(residuen);

        //     var price = document.getElementById("price");
        //     let pricel = residuel * 5;
        //     var pricen = document.createTextNode(pricel);
        //     price.appendChild(pricen);

        //     document.getElementById("input").value = "";

        // }
    // });
 
    const jb = (e) => {
        e.preventDefault();
        const inq = document.getElementById("input").value;
        setInput(inq);
        const nbox = 120*inq;     // 280
        setBox(nbox);
        const residue = 10*nbox;  // 24
        setResidue(residue);
        const nPrice = 5*residue;
        setPrice(nPrice);
            // console.log(nbox);
            // console.log(residue);
            // console.log(nPrice);
    }
    

    return (
        <>
            <div>
                <header className="head-container143">
                    <h1 className="head143">
                        Survey of Punjab satellite images Using GIS(Geographic Information System)
                    </h1>
                    <hr />
                </header>
                <div>
                    <form id="f143" >
                    <label id="l143"><h3>Enter size of farm: (in hector)</h3> </label> 

                        <input type="text" id="input" className="TypeHector" name="input"/>
                        {/* <input type="submit"  id="submit" /> */}

                        <button type="submit" className="btn btn-primary" onClick={jb}>Submit</button>
                        
                    </form>
                    <div className="space"></div>
                    <div id="result143">
                        Box Generated:<div id="box143">{box1}</div>
                        <br />
                        Total residue(waste) Generated (in kgs):<div id="residue">{residue1}</div>
                        <br />
                        Total expected revenue: Rs<div id="price">{price1}</div>
                        <br />
                    </div>

                </div>       
                <div className="space"></div>
                <header>
                    <h1 className="head143">Introduction</h1>
                
                </header>
                <div className="container143">
                    <h1 className="data-head143">SCP(Semi-Automatic Classification Plugin)</h1>
                    <span className="data-para143">We have used well-known GIS software QGIS , Also used SCP(Semi-Automatic Classification) plugin.The Semi-Automatic Classification Plugin (SCP) is a free open source plugin for QGIS that allows  for the supervised classification of remote sensing images, providing tools for the download, the preprocessing and postprocessing of images.
                    </span>       
<br/>
                    <span className="data-para143"> overall objective of SCP is to provide a set of intertwined tools for raster processing in order to make an automatic workflow and ease the land cover classification, which could be performed also by people whose main field is not remote sensing.</span><br />

                    <span className="data-para143">Search and download is available for ASTER, GOES, Landsat, MODIS, Sentinel-1, Sentinel-2, and Sentinel-3 images. Several algorithms are available for the land cover classification. This plugin requires the installation of GDAL, OGR, Numpy, SciPy, and Matplotlib. Some tools require also the installation of SNAP (ESA Sentinel Application Platform).</span>
                        
                </div>
                <div className="space143"></div>
                <span id="raw143">Satellite Image</span><span id="pro143">Processed Image</span><span id="remarks143">Remarks</span>
                <div className="flex143">
                    <img className="img143" src="../images/raw.png" />
                    <img className="img143" src="../images/processed.png" />
                    <img src="../images/label.png" height="10%" />

                </div>
                <div className="space143"></div>
                <div id="csv143">
                    <img id="csvimg143" src="../images/csv.png" height="50%" width="40%" />
                </div>
                <div className="space"></div>
                <div className="space143"></div>
                <footer>
                    <div className="aboutus143">
                    For more details Contact : 21uec123
                    </div>

                </footer>
            </div>
        </>
    );
}

export default Reasearch