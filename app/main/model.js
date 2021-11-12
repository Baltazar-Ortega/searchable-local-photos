const ort = require('onnxruntime-node');
const jimp = require('jimp');
const JPEG = require('jpeg-js');
const pathModule = require('path');
const tree = require("./tree.json")

jimp.decoders['image/jpeg'] = (data) => JPEG.decode(data, {
    maxMemoryUsageInMB: 6144,
    maxResolutionInMP: 600
})

async function getImage(path) {
    let image = await jimp.read(path);
    let resizedImage = await image.resize(224, 224)

    let pixelArray = Int32Array.from(resizedImage.bitmap.data)

    const [R, G, B] = [[], [], []]
    for (let i = 0; i < pixelArray.length; i += 4) {
        R.push(pixelArray[i]);
        G.push(pixelArray[i + 1]);
        B.push(pixelArray[i + 2]);
    }
    const transposedData = R.concat(G).concat(B);

    let i, l = transposedData.length;
    const float32Data = new Float32Array(3 * 224 * 224);
    for (i = 0; i < l; i++) {
        float32Data[i] = transposedData[i] / 255.0;
    }
    return float32Data;

}

function softmax(array) {
    const denominator = array.map(value => {
        return Math.exp(value)
    }).reduce((a, b) => a + b)
    const probabilities = array.map(value => {
        return Math.exp(value) / denominator
    })
    return probabilities
}

function splitLogitsToSemanticsLogits(logits, hierarchyIndicesList) {
    let semanticLogitList = []
    for (let i = 0; i < hierarchyIndicesList.length; i++) {
        let indicesOfHierarchy = hierarchyIndicesList[i]
        let logits_i = indicesOfHierarchy.map(i => logits[i])
        semanticLogitList.push(logits_i)
    }
    return semanticLogitList
}

function getSemanticClasses(semanticLogitList, tree) {
    let classesByHierarchy = []
    const threshold = 0.3
    for (let i = 0; i < semanticLogitList.length; i++) {
        let probabilities = softmax(semanticLogitList[i])

        let biggest_prob = Math.max(...probabilities)

        let indexOfClass = probabilities.findIndex(value => value == biggest_prob)

        if (biggest_prob > threshold) {
            let topClassNumber = tree['hierarchyIndicesList'][i][indexOfClass]
            let topClassName = tree['class_list'][topClassNumber]
            let topClassDescription = tree['class_description'][topClassName]

            classesByHierarchy.push(topClassDescription)
        }
    }
    return classesByHierarchy
}

async function getModelSession() {
    try {
        const session = await ort.InferenceSession.create(pathModule.join(__dirname, 'vit.onnx'));
        return session
    } catch (e) {
        console.error(`failed to create InferenceSession from ONNX model: ${e}.`);
    }
}

async function getImageClasses(imgPath, session) {
    const dims = [1, 3, 224, 224];
    const inputData = await getImage(imgPath)

    const feeds = { input: new ort.Tensor('float32', inputData, dims) };

    const results = await session.run(feeds);

    const logits = Float32Array.from(results.output.data)
    const semanticLogitList = splitLogitsToSemanticsLogits(logits, tree['hierarchyIndicesList'])

    let imageClasses = getSemanticClasses(semanticLogitList, tree)
    return imageClasses
}

module.exports = {
    getModelSession, getImageClasses
}
