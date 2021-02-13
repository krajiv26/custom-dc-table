import React, { useRef, useEffect } from "react";
import * as d3 from 'd3';
import * as dc from "dc";
import 'dc-tableview';
import "dc/dc.css";
import "bootstrap/dist/css/bootstrap.css";
import "./Tabledc.css";
import "dc-tableview/build/dc-tableview-bs.css"
import "dc-tableview/build/dc-tableview-bs"
import $ from "jquery";
$.DataTable = require("datatables.net-buttons-dt");


function Tabledc(props){
    const tableRef = useRef(null);
    const barRef = useRef(null);
    const pieRef = useRef(null);
    const createAlert = (title, text, timeout = 3000) => {
        setTimeout(() => document.querySelector("#alerts .alert").hide(), timeout);
    
        return `<div className="alert alert-success alert-dismissible fade show" role="alert">
            <h6 className="alert-heading">${title}</h6> ${text}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
    };
    
    useEffect(()=>{
        var fmt = d3.format('02d');
        var runDimension = props.ndx.dimension(function(d) {return fmt(+d.Expt);}),
            group = runDimension.group();

        var runDimension2 = props.ndx.dimension(function(d) {return fmt(+d.Expt);}),
            group2 = runDimension2.group();

        var runDimension3 = props.ndx.dimension(function(d) {return +d.Run;});
        var speedSumGroup = runDimension3.group().reduceSum(function(d) {return d.Speed * d.Run / 1000;});

        var chart1 = dc.tableview(tableRef.current, "group1");
        var chart2 = dc.barChart(barRef.current, "group1");
        var chart3 = dc.pieChart(pieRef.current, "group1");

        chart1
        .dimension(runDimension)
        .group(group)
        .columns([
            { title: "Experiment", data: "Expt" },
            { title: "Run", data: "Run" },
            { title: "Speed", data: "Speed" },
        ])
        .enableColumnReordering(true)
        .enablePaging(true)
        .enablePagingSizeChange(true)
        .enableSearch(true)
        .enableScrolling(false)
        .scrollingOptions({
            scrollY: "31rem",
            scrollCollapse: true,
            deferRender: true,
        })
        .rowId("Expt")
        // .showGroups(true)
        // .groupBy("Expt")
        .responsive(true)
        .select(false)
        .fixedHeader(false)
        .buttons(["pdf", "csv", "excel"])
        .sortBy([["Expt", "desc"]])
        .listeners({
            rowClicked: function (row, data, index) {
                var output = document.querySelector("#alerts");
                //output.innerHTML = createAlert(`Click on row ${index}!`, JSON.stringify(data));
            },
            rowDblClicked: function (row, data, index) {
                var output = document.querySelector("#alerts");
                //.innerHTML = createAlert(`Double click on row ${index}!`, JSON.stringify(data));
            },
            rowEnter: function (row, data, index) {
                row.style.backgroundColor = "#eff9ff";
            },
            rowLeave: function (row, data, index) {
                row.style.backgroundColor = "";
            }
        });

        chart2.dimension(runDimension3)
        .group(speedSumGroup)
        .x(d3.scaleLinear().domain([6,20]));

        chart3.dimension(runDimension2)
        .group(group2);

        chart1.render();
        chart2.render();
        chart3.render();

        $("#table-settings #use-paging").on("click", (event, data) => {
            chart1.enableScrolling(false);
            chart1.fixedHeader(true);
        });

        $("#table-settings #use-scrolling").on("click", (event, data) => {
            chart1.fixedHeader(false);
            chart1.enablePaging(true);
            chart1.enableScrolling(true);
        });
        
    },[]);
    

    return (
        <>
        {/* <div ref={divRef}></div> */}
        <div id="alerts"></div>
        <div className="row no-gutters">
        <div className="col-md-8">
            <div id="container1" ref={tableRef} className="chart-container"></div>
            <div className="container-fluid">
                <div id="table-settings" className="btn-group">
                    <button type="button" className="btn btn-outline-secondary">Settings</button>
                    <button type="button" className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="sr-only">Toggle Dropdown</span>
                    </button>
                    <div className="dropdown-menu">
                        <a id="use-paging" className="dropdown-item" href="#">Use paging</a>
                        <a id="use-scrolling" className="dropdown-item" href="#">Use scrolling</a>
                    </div>
                    </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                                <h5 className="card-title">Bar Chart</h5>
                            <div id="container2" ref={barRef} className="chart-container"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row no-gutters">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Pie Chart</h5>
                            <div id="container3" ref={pieRef} className="chart-container"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        </>
    )
}
export default Tabledc;
