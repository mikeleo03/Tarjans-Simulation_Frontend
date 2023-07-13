import React, { useState, useEffect } from "react";
import './App.css'
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GraphSet from "./components/Graph/GraphConfig";
import Form from "./components/Forms/Forms"
import Dropdown from "./components/Dropdown/Dropdown";
// import { calculateTotalWeight } from './helper/helper';

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
    const [solution, setSolution] = useState<number[]>([]);
    const [algorithm, setAlgorithm] = useState(1);
    const [fromAdd, setFromAdd] = useState(0);
    const [toAdd, setToAdd] = useState(0);
    const [fromDel, setFromDel] = useState(0);
    const [toDel, setToDel] = useState(0);
    const [adjArray, setArray] = useState<string[]>([]);

    // Update the adjArray
    useEffect(() => {
        if (graphConfig) {
            const newArray = [];
            for (let i = 0; i < graphConfig.length; i++) {
                newArray.push(graphConfig[i][0]);
            }
            setArray(newArray);
        }
    }, [graphConfig]);

    // Handlers
    const handleAddEdge = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setSolution([]);

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
        setSolution([]);
      
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
                            {graphConfig && 
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
                                {(configFile && graphConfig) ? (<GraphSet graphConfiguration={graphConfig} solution={solution} />) : (<div className="flex items-center justify-center h-full bg-gray-100 rounded-xl text-l">No file loaded.</div>)}
                            </div>
                            <div className='w-1/5 h-full'>
                                <h1 className='text-xl font-bold'>Result</h1>
                                {(algorithm === 1) ? (
                                    <>
                                        {/* <h3>Total Weight : {(solution && solution.length === graphConfig.length - 1) && (calculateTotalWeight(solution))}</h3> */}
                                        <h3>List of SCC</h3>
                                        {/* <div>
                                            {(solution && solution.length === graphConfig.length - 1) ? (
                                                solution.map((obj, index) => (
                                                    <div className="text-base" key={index}>
                                                        Node {obj[0] + 1} - Node {obj[1] + 1} ({obj[2]})
                                                    </div>
                                            ))
                                            ) : (<div className="text-base">No solution</div>)}
                                        </div> */}
                                    </>
                                ) : (
                                    <>
                                        <h3>List of Bridges</h3>
                                        {/* <div>
                                            {(clusters && clusters.length === clusterNum) ? (
                                                clusters.map((obj, index) => (
                                                    <div className="text-base" key={index}>
                                                        Cluster-{index + 1} : {obj.join(', ')}
                                                    </div>
                                            ))
                                            ) : (<div className="text-base">No solution</div>)}
                                        </div> */}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-left flex flex-col w-1/4 p-8 bg-primaryGray rounded-r-xl">
                        <Form algorithm={algorithm} setAlgorithm={setAlgorithm} setConfigFile={setConfigFile} setGraphConfig={setGraphConfig} graphConfig={graphConfig} setSolution={setSolution} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;