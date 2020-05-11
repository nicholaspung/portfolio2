import React from "react"

import Header from "./header"
import { rhythm } from "../utils/typography"

const Layout = ({ title, children }) => {
  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(30),
        padding: `${rhythm(0.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <Header title={title} />
      <main>{children}</main>
      <footer style={{ textAlign: "center" }}>
        <br />
        <br />© {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
