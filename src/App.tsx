import React, { useState, useEffect } from "react";
import './App.css'
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GraphSet from "./components/Graph/GraphConfig";
import Form from "./components/Forms/Forms"
import Dropdown from "./components/Dropdown/Dropdown";

const backgroundStyle = {
    backgroundColor : "#ECEEF9",
    height: "auto",
    width: "100vw",
    minHeight: "100vh",
    maxHeight: "100vh",
}

function App() {
    // Program states
    const [configFile, setConfigFile] = useState<File>();
    const [graphConfig, setGraphConfig] = useState<[string, string[]][]>([]);
    const [solutionSCC, setSolutionSCC] = useState<string[][]>([]);
    const [solutionBridges, setSolutionBridges] = useState<string[][]>([]);
    const [algorithm, setAlgorithm] = useState(1);
    const [fromAdd, setFromAdd] = useState(0);
    const [toAdd, setToAdd] = useState(0);
    const [fromDel, setFromDel] = useState(0);
    const [toDel, setToDel] = useState(0);
    const [adjArray, setArray] = useState<string[]>([]);
    const [time, setTime] = useState(-1);

    // Update the adjArray
    useEffect(() => {
        if (graphConfig) {
            const newArray : string[] = [];
            for (let i = 0; i < graphConfig.length; i++) {
                for (let j = 0; j < graphConfig[i][1].length; j++) {
                    if (!newArray.includes(graphConfig[i][1][j])) {
                        newArray.push(graphConfig[i][1][j]);
                    }
                }
            }
            setArray(newArray.sort());
        }
    }, [graphConfig]);

    // Handlers
    const handleAddEdge = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setSolutionSCC([]);
        setSolutionBridges([]);
        setTime(-1);

        // The mechanism
        let edgeAlreadyExists = false;
        for (const [node, neighbors] of graphConfig) {
            if (node === adjArray[fromAdd] && neighbors.includes(adjArray[toAdd])) {
                edgeAlreadyExists = true;
                break;
            }
        }

        if (edgeAlreadyExists) {
            toast.error("Edge already exists", {
                position: toast.POSITION.TOP_RIGHT
            });
        }  else {
            // Find the entry for 'from' node in the adjacency list
            const fromNode = graphConfig.find(([node]) => node === adjArray[fromAdd]);

            // Add 'to' node to the adjacency list of 'from' node
            if (fromNode) {
                fromNode[1].push(adjArray[toAdd]);
            } else {
                graphConfig.push([adjArray[fromAdd], [adjArray[toAdd]]]);
            }

            toast.success("New edge added", {
                position: toast.POSITION.TOP_RIGHT
            });
        }

        // Reset the graph configuration
        setGraphConfig([...graphConfig]);      
    }

    const handleDeleteEdge = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setSolutionSCC([]);
        setSolutionBridges([]);
        setTime(-1);
      
        // The mechanism
        let edgeFound = false;
        for (const [node, neighbors] of graphConfig) {
            if (node === adjArray[fromDel] && neighbors.includes(adjArray[toDel])) {
                const index = neighbors.indexOf(adjArray[toDel]);
                neighbors.splice(index, 1);
                edgeFound = true;
                break;
            }
        }
      
        if (edgeFound) {
            toast.success("Edge deleted", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            toast.error("Edge not found", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
      
        // Reset the graph configuration
        setGraphConfig([...graphConfig]);
    };      

    return (
        <div style={backgroundStyle} className="flex p-[1.5vh]">
            <ToastContainer />
            <div className="w-full bg-light flex rounded-xl">
                <div className="bg-white w-full mx-auto shadow-xl rounded-xl text-lg flex flex-row h-full">
                    <div className="text-left flex flex-col w-3/4 space-y-3 p-8">
                        <div className='h-1/6 flex flex-row'>
                            <div className="w-1/3">
                                <h1 className='text-3xl font-bold'>Graph</h1>
                                <h3 className='text-xl py-1.5 font-semibold text-primaryBlue'>Based on input result</h3>
                            </div>
                            {(graphConfig.length !== 0) && 
                            <div className="w-2/3 flex flex-row gap-x-4 w-full">
                                <div className="w-1/2 flex flex-row bg-primaryGray rounded-xl space-x-4 p-3">
                                    <div>
                                        <label className="font-medium">
                                            From
                                        </label>
                                        <Dropdown menuItems={adjArray} selectedItem={fromAdd} setSelectedItem={setFromAdd} maxHeight={40} height={0}/>
                                    </div>
                                    <div>
                                        <label className="font-medium">
                                            To
                                        </label>
                                        <Dropdown menuItems={adjArray} selectedItem={toAdd} setSelectedItem={setToAdd} maxHeight={40} height={0}/>
                                    </div>
                                    <div className="flex items-center">
                                        <button className='px-4 py-1.5 text-sm text-white font-medium bg-primaryBlue hover:bg-indigo-400 active:bg-indigo-600 rounded-lg duration-150' onClick={(e) => handleAddEdge(e)}>Add Edge</button>
                                    </div>
                                </div>
                                <div className="w-1/2 flex flex-row bg-primaryGray rounded-xl space-x-4 p-3">
                                    <div>
                                        <label className="font-medium">
                                            From
                                        </label>
                                        <Dropdown menuItems={adjArray} selectedItem={fromDel} setSelectedItem={setFromDel} maxHeight={40} height={0}/>
                                    </div>
                                    <div>
                                        <label className="font-medium">
                                            To
                                        </label>
                                        <Dropdown menuItems={adjArray} selectedItem={toDel} setSelectedItem={setToDel} maxHeight={40} height={0}/>
                                    </div>
                                    <div className="flex items-center">
                                        <button className='px-4 py-1.5 text-sm text-white font-medium bg-primaryBlue hover:bg-indigo-400 active:bg-indigo-600 rounded-lg duration-150' onClick={(e) => handleDeleteEdge(e)}>Delete Edge</button>
                                    </div>
                                </div>
                            </div>}
                        </div>
                        <div className='h-5/6 p-5 rounded-lg bg-gray-200 flex flex-row w-full space-x-5'>
                            <div className='w-4/5'>
                                {(configFile && graphConfig) ? (<GraphSet graphConfiguration={graphConfig} solutionSCC={solutionSCC} solutionBridges={solutionBridges} algorithm={algorithm} length={adjArray.length} />) : (<div className="flex items-center justify-center h-full bg-gray-100 rounded-xl text-l">No file loaded.</div>)}
                            </div>
                            <div className='w-1/5 h-full'>
                                <h1 className='text-xl font-bold'>Result</h1>
                                {(algorithm === 1) ? (
                                    <>
                                        <h3>List of SCC</h3>
                                        <h3>Execution time : </h3>
                                        <h3>{(algorithm === 1 && time !== - 1) ? (time) : ("-")} ns</h3>
                                        <div>
                                            {(solutionSCC) ? (
                                                solutionSCC.map((obj, index) => (
                                                    <div className="text-base" key={index}>
                                                        SCC-{index + 1} : {obj.join(', ')}
                                                    </div>
                                            )
                                            )) : (<div className="text-base">No solution</div>)}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3>List of Bridges</h3>
                                        <h3>Execution time : </h3>
                                        <h3>{(algorithm === 2 && time !== - 1) ? (time) : ("-")} ns</h3>
                                        <div>
                                            {(solutionBridges) ? (
                                                solutionBridges.map((obj, index) => (
                                                    <div className="text-base" key={index}>
                                                        Bridge-{index + 1} : {obj[0]} - {obj[1]}
                                                    </div>
                                            )
                                            )) : (<div className="text-base">No solution</div>)}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-left flex flex-col w-1/4 p-8 bg-primaryGray rounded-r-xl">
                        <Form algorithm={algorithm} setAlgorithm={setAlgorithm} setConfigFile={setConfigFile} setGraphConfig={setGraphConfig} graphConfig={graphConfig} setSolutionSCC={setSolutionSCC} setSolutionBridges={setSolutionBridges} adjArray={adjArray} setTime={setTime}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;