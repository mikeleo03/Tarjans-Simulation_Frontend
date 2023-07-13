import Graph from "react-graph-vis";
import { useState, useMemo, useEffect } from "react";
import { v4 as uuid } from 'uuid';
import addMissingPairs from '../../helper/helper';

interface GraphSetProps {
    graphConfiguration: [string, string[]][];
    solutionSCC: string[][];
    solutionBridges: string[][];
    algorithm: number;
    length: number;
}

interface Node {
    id: string;
    label: string;
    color: {
        background: string;
        border: string;
        highlight: string;
    };
    labelHighlightBold : boolean;
    shape: string;
}

interface Edge {
    from: string; 
    to: string; 
    arrows: { to: boolean }; 
    physics: boolean; 
    color: { color: string; highlight: string; }; 
    labelHighlightBold: boolean; 
    selectionWidth: number;
    smooth: {enabled: boolean, type: string, roundness: number}
}

interface GraphElement {
    nodes: Node[];
    edges: Edge[];
}

const GraphSet: React.FC<GraphSetProps> = ({ graphConfiguration, solutionSCC, solutionBridges, algorithm, length }) => {
    // Basic screen configuration
    const [windowWidth, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const updateWidth = () => {
            setWidth(window.innerWidth)
        }

        window.addEventListener('resize', updateWidth);
        return(() => {
            window.removeEventListener('resize', updateWidth);
        })

    }, [windowWidth])

    // Grpah components
    const nodeCount = graphConfiguration.length;
    const [graph, setGraph] = useState<GraphElement>({
        nodes: [],
        edges: []
    })

    useEffect(() => {
        // Graph configuration
        const tempGraph : GraphElement = {
            nodes: [],
            edges: []
        }

        if (solutionSCC.length === 0 && solutionBridges.length === 0) {
            for (var i = 0; i < nodeCount; i++) {
                // Graph element
                tempGraph.nodes.push({
                    id: graphConfiguration[i][0],
                    label: "Node " + graphConfiguration[i][0],
                    color: {
                        background: 'white',
                        border: "#5358e2",
                        highlight: "#5358e2"
                    },
                    labelHighlightBold: false,
                    shape: "circle",
                })

                // Setup edge
                let tempEdge : Edge;
                for (var j = 0; j < graphConfiguration[i][1].length; j++) {
                    tempEdge = {
                        from: graphConfiguration[i][0],
                        to: graphConfiguration[i][1][j],
                        arrows: {
                            to: algorithm === 1 ? true : false,
                        },
                        physics: false,
                        color: {
                            color: "#5358e2",
                            highlight: "#5358e2"
                        },
                        labelHighlightBold: true,
                        selectionWidth: 0,
                        smooth: algorithm === 1 ? {enabled: true,  type: 'curvedCW', roundness: 0.25} : {enabled: false,  type: '', roundness: 0}
                    }

                    tempGraph.edges.push(tempEdge);
                }
            }
        } else if (solutionSCC.length !== 0) {
            let colorlist = ["#ce76fe", "#ed6f71", "#feae33", "#5358e2", "#fec46b"];

            // Nodes
            for (var i = 0; i < solutionSCC.length; i++) {
                for (var j = 0; j < solutionSCC[i].length; j++) {
                    // Graph element
                    tempGraph.nodes.push({
                        id: solutionSCC[i][j],
                        label: "Node " + solutionSCC[i][j],
                        color: {
                            background: colorlist[i % 5],
                            border: colorlist[i % 5],
                            highlight: colorlist[i % 5]
                        },
                        labelHighlightBold: false,
                        shape: "circle",
                    })
                }
            }

            // Edges
            for (var i = 0; i < nodeCount; i++) {
                // Setup edge
                let tempEdge : Edge;
                for (var j = 0; j < graphConfiguration[i][1].length; j++) {
                    tempEdge = {
                        from: graphConfiguration[i][0],
                        to: graphConfiguration[i][1][j],
                        arrows: {
                            to: true,
                        },
                        physics: false,
                        color: {
                            color: "black",
                            highlight: "black"
                        },
                        labelHighlightBold: true,
                        selectionWidth: 0,
                        smooth: {enabled: true,  type: 'curvedCW', roundness: 0.25}
                    }

                    tempGraph.edges.push(tempEdge);
                }
            }
        } else if (solutionBridges.length !== 0) {
            // Capture a complete pairs for edge coloring
            const pairList = addMissingPairs(solutionBridges);

            for (var i = 0; i < nodeCount; i++) {
                // Check its coresponding
                let secondEl;
                let paired = false;
                for (const pair of pairList) {
                    const [first, second] = pair;
                
                    // Check if the character exists in the first element of the pair
                    if (first === graphConfiguration[i][0]) {
                        secondEl = second;
                        paired = true;
                        break;
                    }
                }

                // Graph element
                tempGraph.nodes.push({
                    id: graphConfiguration[i][0],
                    label: "Node " + graphConfiguration[i][0],
                    color: {
                        background: paired ? "#ed6f71" : '#feae33',
                        border: paired ? "#ed6f71" : '#feae33',
                        highlight: paired ? "#ed6f71" : '#feae33'
                    },
                    labelHighlightBold: false,
                    shape: "circle",
                })

                // Setup edge
                let tempEdge : Edge;
                for (var j = 0; j < graphConfiguration[i][1].length; j++) {
                    tempEdge = {
                        from: graphConfiguration[i][0],
                        to: graphConfiguration[i][1][j],
                        arrows: {
                            to: false,
                        },
                        physics: false,
                        color: {
                            color: graphConfiguration[i][1][j] === secondEl ? "black" : "#feae33",
                            highlight: graphConfiguration[i][1][j] === secondEl ? "black" : "#feae33"
                        },
                        labelHighlightBold: true,
                        selectionWidth: 0,
                        smooth: {enabled: false,  type: '', roundness: 0}
                    }

                    tempGraph.edges.push(tempEdge);
                }
            }
        }
        
        setGraph(tempGraph);

    }, [graphConfiguration, solutionSCC, solutionBridges])

    // Graph key to make graph more static
    const graphKey = useMemo(uuid, [graph, graphConfiguration, (algorithm === 1) ? (solutionSCC) : (solutionBridges)])

    const options = {
        layout: {
            randomSeed: 1,
        },
        edges: {
            color: "#000000",
        },
        height: "400px"
    };

    const events = {
        select: function(event: { nodes: string[]; edges: string[] }) {
            var { nodes, edges } = event;
            // Rest of your code
        }
    };  

    return ( 
        <div className="w-full">
            <Graph
                style={{
                    backgroundColor: '#fafafa',
                    overflow: 'hidden',
                    margin: 'auto',
                    width: '100%',
                    borderRadius: '10px',
                }}
                key={graphKey}
                graph={graph}
                options={options}
                events={events}
            />

            <h3 className='py-2 font-semibold text-lg'>Drag and rearrange the nodes for more accurate interpretation</h3>
        </div>
     );
}
 
export default GraphSet;