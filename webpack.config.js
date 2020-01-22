const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
// const { CleanWebpackPlugin } = require("clean-webpack-plugin")
// console.log({ CleanWebpackPlugin, HtmlWebpackPlugin })
module.exports = {
    entry: "./src/examples/index.tsx",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.less$/,
                use: ["style-loader", 'css-loader', 'less-loader']
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./dist"
    },
    plugins: [
        // new CleanWebpackPlugin(["dist"]),
        new HtmlWebpackPlugin({
            template: "./index.html"
        })
    ],
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    }
}
