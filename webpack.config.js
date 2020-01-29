const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const env = process.env.NODE_ENV || "dev"
const distPath = path.resolve(__dirname, "lib")
const createStyledComponentsTransformer = require("typescript-plugin-styled-components").default
const styledComponentsTransformer = createStyledComponentsTransformer()

const commonPlugins = [new HtmlWebpackPlugin({ template: "./assets/template.html" })]

const configBase = {
    entry: { index: "./src/examples/index.tsx" },
    output: { filename: "[name].bundle.js", chunkFilename: "[name].js", path: distPath },
    devtool: "source-map",
    resolve: { extensions: [".ts", ".tsx", ".js", ".json"] },
    module: {
        rules: [
            { test: /\.less$/, use: ["style-loader", "css-loader", "less-loader"] },
            { test: /\.css$/i, use: ["style-loader", "css-loader"] },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                options: {
                    getCustomTransformers: () => ({ before: [styledComponentsTransformer] })
                }
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            { test: /\.(png|jpe?g|gif|ico|svg|woff2?|ttf|eot)$/i, use: [{ loader: "file-loader" }] }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: { test: /node_modules/, name: "vendors", chunks: chunk => chunk.name !== "pre-main.min" }
            }
        }
    }
}

const dev = {
    mode: "development",
    watch: true,
    devServer: { contentBase: path.join(__dirname), compress: true, port: 8888, historyApiFallback: true },
    plugins: commonPlugins
}

const prod = {
    mode: "production",
    plugins: commonPlugins,
    optimization: { ...configBase.optimization, minimize: true }
}
const config = Object.assign(configBase, env == "production" ? prod : dev)
module.exports = config
