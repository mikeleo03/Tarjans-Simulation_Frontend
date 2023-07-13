import React, { useState, useRef } from "react";
import UploadImage from '../../assets/upload.png'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { convertMatrixToIntegers } from '../../helper/helper';

interface FormProps {
    algorithm: number;
    setAlgorithm : (value : number) => void;
    setConfigFile : (value : File) => void;
    setMatrix : (value : string[][]) => void;
    adjMatrix : string[][];
    setSolution : (value : number[]) => void;
}

// Compression Forms Component
const Forms: React.FC<FormProps> = ({ algorithm, setAlgorithm, setConfigFile, setMatrix, adjMatrix, setSolution }) => {
    const textRef = useRef<HTMLParagraphElement>(null);
    const infoRef = useRef<HTMLParagraphElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSolution([]);
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
                setMatrix(res.data);
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
    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSolution([]);

        if (adjMatrix) {
            // Convert the adjMatrix into matrix of integer
            // let adjacency = convertMatrixToIntegers(adjMatrix);

            // Do the algorithm
            if (algorithm === 1) {
                // Do SCC
                // let primMST = SCC(adjacency);
                // primMST.length === adjMatrix.length - 1 ? setSolution(primMST) : setSolution(null);
            } else {
                // Do Bridges
                // let kruskalMST = Bridges(adjacency);
                // kruskalMST.length === adjMatrix.length - 1 ? setSolution(kruskalMST) : setSolution(null);
            }
        } else {
            toast.error("You haven't load any .txt file, yet!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    // Do the clustering
    const handleClustering = (e : React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSolution([]);

        if (adjMatrix) {
            // // Convert the adjMatrix into matrix of integer
            // let adjacency = convertMatrixToIntegers(adjMatrix);
            // // Do the algorithm
            // let kruskalMST = Bridges(adjacency);
            // kruskalMST.length === adjMatrix.length - 1 ? setSolution(kruskalMST) : setSolution(null);
            // let [clustersRes, removed] = clusterMST(kruskalMST, adjacency, clusterNum);

            // // Handle result
            // clustersRes.length === clusterNum ? setClusters(clustersRes) : setClusters(null);
            // removed.length === clusterNum - 1 ? setClusterRemove(removed) : setClusterRemove(null);

        } else {
            toast.error("You haven't load any .txt file, yet!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const isConfigFileValid = ({ lines }: { lines: string[] }): { success: boolean, msg: string, data?: string[][] } => {
        if (!lines || lines.length === 0 || lines[0].length === 0) {
            return { success: false, msg: "Configuration file is empty!" };
        }
      
        const matrix = lines.map((line) => line.split(/\s+/));
        const row = matrix.length;
        const column = matrix[0].length;
      
        for (let i = 0; i < row; i++) {
            const line = matrix[i];
            if (line.length !== column) {
                return { success: false, msg: "Configuration file contains rows with different lengths!" };
            }
        
            for (let j = 0; j < column; j++) {
                const stringValue = line[j];
                if (!(/^\d+$/.test(stringValue))) {
                    return { success: false, msg: "Configuration file contains invalid character(s)!\nPositive numbers are the only valid characters" };
                }
            }
        }
      
        if (row !== column) {
            return { success: false, msg: "Adjacency matrix must have the same number of rows and columns!" };
        }
      
        for (let j = 0; j < row; j++) {
            for (let k = 0; k < column; k++) {
                if (matrix[j][k] !== matrix[k][j]) {
                    return { success: false, msg: "Adjacency matrix for an undirected graph should be symmetric!" };
                }
            }
        }
      
        return { success: true, msg: "Configuration File is valid", data: matrix };
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
                                    <input type="radio" id="SCC" name="SCC" value="SCC" checked={algorithm === 1} onChange={() => {setAlgorithm(1); setSolution([]);}} className="peer hidden"></input>
                                    <label htmlFor="SCC" className="text-sm block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-primaryBlue font-bold peer-checked:text-white h-full flex justify-center items-center">SCC</label>
                                </div>
                                <div>
                                    <input type="radio" id="Bridges" name="Bridges" value="Bridges" checked={algorithm === 2} onChange={() => {setAlgorithm(2); setSolution([]);}} className="peer hidden"></input>
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