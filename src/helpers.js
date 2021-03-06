const f = require("./functions.js");
const { isArray, isString, hasProperty } = require("./validators.js");

// Args processing

const processQueryArgs = cmd => {
    const columnArgs = ["select", "where", "by"];
    for (const key of columnArgs) {
        if (!hasProperty(cmd, key)) {
            continue;
        }

        cmd[key] = toArgsArray(cmd[key]);
        for (let i = 0; i < cmd[key].length; i++) {
            cmd[key][i] = processFunctions(cmd[key][i]);
        }
        cmd[key] = processStringArgs(cmd[key]);
    }

    const fromKey = "from";
    if (hasProperty(cmd, fromKey)) {
        cmd[fromKey] = f.toTable(cmd[fromKey]);
    }

    return cmd;
};

const processDeleteArgs = cmd => toArgsArray(cmd);

const processStringArgs = cmd => {
    for (let i = 0; i < cmd.length; i++) {
        if (isString(cmd[i])) {
            cmd[i] = f.toId(cmd[i]);
        }
    }

    return cmd;
};

const processFunctions = cmd => {
    const unaryFunctions = {
        id: f.id,
        alias: f.alias,
        avg: f.avg,
        bool: f.bool,
        count: f.count,
        dev: f.dev,
        float: f.float,
        int: f.int,
        last: f.last,
        max: f.max,
        min: f.min,
        month: f.month,
        str: f.str,
        sum: f.sum,
        sums: f.sums,
        unique: f.unique,
        variance: f.variance,
        year: f.year
    };

    const binaryFunctions = {
        add: f.add,
        bar: f.bar,
        datetime: f.datetime,
        div: f.div,
        ema: f.ema,
        eq: f.eq,
        gt: f.gt,
        gte: f.gte,
        lt: f.lt,
        lte: f.lte,
        mavg: f.mavg,
        mdev: f.mdev,
        mul: f.mul,
        neq: f.neq,
        sub: f.sub,
        time: f.time
    };

    let translatedCmd = cmd;
    if (!isArray(cmd) && typeof cmd === "object") {
        for (const prop in cmd) {
            if (prop in unaryFunctions) {
                translatedCmd = unaryFunctions[prop](cmd[prop]);
            } else if (prop in binaryFunctions) {
                if (!isArray(cmd[prop]) || cmd[prop].length < 2) {
                    throw new Error(`missing argument in ${prop} function`);
                }
                for (let i = 0; i < cmd[prop].length; i++) {
                    cmd[prop][i] = processFunctions(cmd[prop][i]);
                }
                translatedCmd = binaryFunctions[prop](cmd[prop]);
            }
        }
    }

    return translatedCmd;
};

const toArgsArray = cmd => {
    if (!isArray(cmd)) {
        cmd = [cmd];
    }
    return cmd;
};

// Others

const fixUrl = url => {
    url = url.trim().replace(/\s/g, "");

    if (/^(:\/\/)/.test(url)) {
        url = `http${url}`;
    } else if (!/^(f|ht)tps?:\/\//i.test(url)) {
        url = `http://${url}`;
    }

    if (!url.endsWith("/")) {
        url += "/";
    }

    return url;
};

module.exports = {
    processQueryArgs,
    processDeleteArgs,
    fixUrl
};
