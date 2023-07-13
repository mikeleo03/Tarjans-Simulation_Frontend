import React, { useRef } from "react";
import UploadImage from '../../assets/upload.png'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const url = process.env.REACT_APP_BACKEND_URL_DEV;

interface FormProps {
    algorithm: number;
    setAlgorithm : (value : number) => void;
    setConfigFile : (value : File) => void;
    setGraphConfig : (value : [string, string[]][]) => void;
    graphConfig : [string, string[]][];
    setSolutionSCC : (value : string[][]) => void;
    setSolutionBridges : (value : string[][]) => void;
    adjArray : string[];
    setTime : (value : number) => void;
}

// Compression Forms Component
const Forms: React.FC<FormProps> = ({ algorithm, setAlgorithm, setConfigFile, setGraphConfig, graphConfig, setSolutionSCC, setSolutionBridges, adjArray, setTime }) => {
    const textRef = useRef<HTMLParagraphElement>(null);
    const infoRef = useRef<HTMLParagraphElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSolutionSCC([]);
        setSolutionBridges([]);
        const file = e.target.files?.[0];

        if (file) {
            if (textRef && textRef.current) {
                textRef.current.textContent = 'File uploaded sucessfully!';
            }
            if (infoRef && infoRef.current) {
                infoRef.current.textContent = `${file.name}`;
            }

            // File reading process
            var res = await readFile({file: file, validationFunction: isConfigFileValid})

            if (res.success) {
                setConfigFile(file);
                setGraphConfig(res.data);
            } else {
                toast.error(res.msg, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }
    }

    const readFile = async ({ file, validationFunction }: { file: File, validationFunction: Function }) => {
        const lines = await new Promise<string[]>((resolve) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                if (e.target?.result) {
                    const res = (e.target.result as string).split(/\r?\n/);
                    resolve(res);
                }
            };
        
            reader.readAsText(file);
        });
      
        return validationFunction({ lines: lines });
    };      

    // Do the process based on the algorithm
    const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
        event.preventDefault();
        setSolutionSCC([]);
        setSolutionBridges([]);

        if (graphConfig) {
            try {
                if (algorithm === 1) {
                    const convertedEdges: { [key: string]: string[] } = {};
                    graphConfig.forEach(edge => {
                        const sourceNode = edge[0];
                        const targetNodes = edge[1];
                        convertedEdges[sourceNode] = targetNodes;
                    });

                    // Proses SCC
                    fetch(url + "/api/scc", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            "nodes": adjArray,
                            "edges": convertedEdges,
                        }),
                    })
                    .then((res) => res.json())
                    .then((data) => {
                        // Update state              
                        if (data.status === false) {
                            toast.error(data.msg, {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        } else {
                            // Value retriving
                            console.log(data);
                            setSolutionSCC(data.value);
                            data.time ? setTime(data.time) : setTime(0);
                        }
                    });
                } else {
                    // Proses bridges
                    fetch(url + "/api/bridges", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            "nodes": adjArray,
                            "edges": graphConfig,
                        }),
                    })
                    .then((res) => res.json())
                    .then((data) => {
                        // Update state              
                        if (data.status === false) {
                            toast.error(data.msg, {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        }
                        
                        setSolutionBridges(data.value);
                    });
                }

            } catch (error) {
                toast.error("Error processing : " + error, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } else {
            toast.error("You haven't load any .txt file, yet!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const isConfigFileValid = ({ lines }: { lines: string[] }): { success: boolean, msg: string, data?: [string, string[]][] } => {
        if (!lines || lines.length === 0 || lines[0].length === 0) {
            return { success: false, msg: "Configuration file is empty!" };
        }
    
        const adjacencyList: [string, string[]][] = [];
    
        for (const line of lines) {
            const nodes = line.trim().split(/\s+/);
    
            // Validate if the line has exactly two nodes
            if (nodes.length !== 2) {
                return { success: false, msg: "Invalid line in the configuration file!" };
            }
    
            const [nodeA, nodeB] = nodes;
    
            // Validate if the nodes have exactly two characters
            if (nodeA.length !== 1 || nodeB.length !== 1) {
                return { success: false, msg: "Invalid node(s) in the configuration file!" };
            }
    
            // Find the entry for nodeA in the adjacency list
            const nodeEntry = adjacencyList.find(([node]) => node === nodeA);
    
            // Add the nodes to the adjacency list
            if (nodeEntry) {
                nodeEntry[1].push(nodeB);
            } else {
                adjacencyList.push([nodeA, [nodeB]]);
            }
        }
    
        // Validate if there are no isolated nodes
        for (const [node, neighbors] of adjacencyList) {
            if (neighbors.length === 0) {
                return { success: false, msg: `Node ${node} is isolated and has no outgoing edges!` };
            }
        }
    
        return { success: true, msg: "Configuration File is valid", data: adjacencyList };
    };              

    return (
        <main className="h-full">
            <div className="h-full mx-auto px-0 text-gray-600">
                <div className="h-full mx-auto flex flex-col space-y-3">
                    <div>
                        <h1 className='text-3xl font-bold'>Tarjans Algorithm</h1>
                        <h3 className='text-base py-1.5 font-semibold text-primaryBlue'>Fill this form to configure the graph.</h3>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <div>
                            <label className="font-medium">
                                Upload graph configuration
                            </label>
                            <input
                                type="file"
                                id="file-btn"
                                accept=".txt"
                                onChange={(e) => handleUpload(e)}
                                onClick={(e) => {
                                    const target = e.currentTarget as HTMLInputElement;
                                    target.value = "";
                                }}
                                hidden
                            />
                            <label htmlFor="file-btn" className="w-full">
                                <div className="border-2 border-dashed border-white-3 rounded-2xl p-4 py-2.5 w-full flex flex-col items-center cursor-pointer bg-primaryYellow hover:bg-secondaryYellow duration-200 mt-2">
                                    <img
                                        src={UploadImage}
                                        className="block h-14"
                                        alt=""
                                    />
                                    <p className="text-sm font-bold text-white text-center" ref={textRef}>
                                        Upload graph config here...
                                    </p>
                                    <p className="text-sm font-normal text-white text-center mt-1" ref={infoRef}>
                                        You haven't uploaded anything!
                                    </p>
                                </div>
                            </label>
                        </div>
                        <div>
                            <label className="font-medium">
                                Choose the process
                            </label>
                            <div className="flex flex-col mt-2 grid grid-cols-2 space-x-2 rounded-lg bg-secondaryYellow p-1.5">
                                <div>
                                    <input type="radio" id="SCC" name="SCC" value="SCC" checked={algorithm === 1} onChange={() => {setAlgorithm(1); setSolutionSCC([]); setSolutionBridges([]);}} className="peer hidden"></input>
                                    <label htmlFor="SCC" className="text-sm block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-primaryBlue font-bold peer-checked:text-white h-full flex justify-center items-center">SCC</label>
                                </div>
                                <div>
                                    <input type="radio" id="Bridges" name="Bridges" value="Bridges" checked={algorithm === 2} onChange={() => {setAlgorithm(2); setSolutionSCC([]); setSolutionBridges([]);}} className="peer hidden"></input>
                                    <label htmlFor="Bridges" className="text-sm block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-primaryBlue font-bold peer-checked:text-white h-full flex justify-center items-center">Bridges</label>
                                </div>
                            </div>
                            <button
                                className="w-full px-4 py-1.5 mt-3 text-white text-sm font-medium bg-primaryBlue hover:bg-indigo-400 active:bg-indigo-600 rounded-lg duration-150"
                                onClick={(e) => handleSubmit(e)}
                            >
                                Search!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Forms;