import {PathsType} from "../sources/mouse_path";

export const chaikin = (paths: PathsType) => {
    if(paths.length<3){
        return paths;
    }

    const first = paths[0];
    const last = paths[paths.length - 1];

    const path = [first];
    const percent = 0.25;
    for (let i = 0; i < paths.length - 1; i++) {
        const p0 = {
            time: 0,
            x: paths[i][1],
            y: paths[i][2],
            cursor: paths[i][3]
        }
        const p1 = {
            time: 0,
            x: paths[i+1][1],
            y: paths[i+1][2],
            cursor: paths[i+1][3]
        }
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;

        path.push([0, p0.x + dx * percent, p0.y + dy * percent, p0.cursor ]);
        path.push([0, p0.x + dx * (1 - percent), p0.y + dy * (1 - percent), p1.cursor ]);
    }
    path.push(last)
    return path;
}

export const chaikinSmooth = (paths: PathsType, smoothness: number) => {
    for (let i = 0; i < smoothness; i++) {
        paths = chaikin(paths);
    }
    return paths;
}