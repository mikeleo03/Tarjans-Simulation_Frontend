import Graph from "react-graph-vis";
import { useState, useMemo, useEffect } from "react";
import { v4 as uuid } from 'uuid';

interface GraphSetProps {
    graphConfiguration: [string, string[]][];
    solutionSCC: number[];
    solutionBridges: number[];
    algorithm: number;
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

const GraphSet: React.FC<GraphSetProps> = ({ graphConfiguration, solutionSCC, solutionBridges, algorithm }) => {
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
            for (var j = 0; j < graphConfiguration[i][1].length; j++) {
                let tempEdge;
                if (solutionSCC.length !== 0 || solutionBridges.length !== 0) {
                    tempEdge = {
                        from: graphConfiguration[i][0],
                        to: graphConfiguration[i][1][j],
                        arrows: {
                            to: true,
                        },
                        physics: false,
                        color: {
                            color: "#feae33",
                            highlight: "#feae33"
                        },
                        labelHighlightBold: true,
                        selectionWidth: 0,
                        smooth: {enabled: true,  type: 'curvedCW', roundness: 0.25}
                    }

                    // Check the solution
                    // let sortedAdj1 = sortFirstAndSecond1(solution);
                    // for (let p = 0; p < sortedAdj1.length; p++) {
                    //     if (sortedAdj1[p][0] == i && sortedAdj1[p][1] == j) {
                    //         tempEdge.color.color = "#dc2626";
                    //     }
                    // }
                    // let sortedAdj2 = sortFirstAndSecond2(solution);
                    // for (let p = 0; p < sortedAdj2.length; p++) {
                    //     if (sortedAdj2[p][0] == i && sortedAdj2[p][1] == j) {
                    //         tempEdge.color.color = "#dc2626";
                    //     }
                    // }

                    // if (clusterRemove) {
                    //     let arrRemove = clusterRemove.map(obj => [obj.src, obj.dest, obj.weight]);
                    //     // Check the clusterRemove
                    //     let sortedCluster1 = sortFirstAndSecond1(arrRemove);
                    //     for (let p = 0; p < sortedCluster1.length; p++) {
                    //         if (sortedCluster1[p][0] == i && sortedCluster1[p][1] == j) {
                    //             tempEdge.color.color = "#e2e8f0";
                    //         }
                    //     }
                    //     let sortedCluster2 = sortFirstAndSecond2(arrRemove);
                    //     for (let p = 0; p < sortedCluster2.length; p++) {
                    //         if (sortedCluster2[p][0] == i && sortedCluster2[p][1] == j) {
                    //             tempEdge.color.color = "#e2e8f0";
                    //         }
                    //     }
                    // }

                } else {
                    tempEdge = {
                        from: graphConfiguration[i][0],
                        to: graphConfiguration[i][1][j],
                        arrows: {
                            to: true,
                        },
                        physics: false,
                        color: {
                            color: "#5358e2",
                            highlight: "#5358e2"
                        },
                        labelHighlightBold: true,
                        selectionWidth: 0,
                        smooth: {enabled: true,  type: 'curvedCW', roundness: 0.25}
                    }
                }

                tempGraph.edges.push(tempEdge);
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