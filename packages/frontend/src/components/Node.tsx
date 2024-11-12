import Konva from "konva";
import { Circle, Group } from "react-konva";

type NodeProps = {
    x: number;
    y: number;
    children?: React.ReactNode;
}

export default function Node ({
    x,
    y,
    children,
}: NodeProps) {

    return(
        <Group x={x} y={y}>
            {children}
        </Group>
    )
}

type NodeCirleProps = {
    radius: number;
    fill: string;
}

Node.Circle = function ({
    radius,
    fill,
}: NodeCirleProps) {
    return (
        <Circle
            x={0}
            y={0}
            radius={radius}
            fill={fill}
        />
    )
}


function HeadNode ({
    
}) {
    return (
        <Node x={0} y={0}>

        </Node>

    )
}


