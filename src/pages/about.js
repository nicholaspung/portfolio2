import React from "react"
import { graphql } from "gatsby"
import { css } from "@emotion/core"

import Layout from "../components/layout"
import SEO from "../components/seo"

const About = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const about = data.allMarkdownRemark.edges[0].node
  // const [infoToggle, setInfoToggle] = React.useState(false)

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="About" />
      <h2
        css={css`
          border-bottom: 1px solid black;
        `}
      >
        {about.frontmatter.title}
      </h2>
      <div
        css={css`
          ul {
            margin-left: 1.75rem;
          }
        `}
        dangerouslySetInnerHTML={{ __html: about.html }}
      />
      {/* <div>
        <button
          onClick={() => setInfoToggle(!infoToggle)}
          css={css`
            background: white;
            border: none;
            border-bottom: 1px solid black;
            cursor: pointer;
            padding: 0;
            margin-bottom: 0.5rem;
            &:hover {
              color: blue;
              border-bottom: 0;
            }
          `}
        >
          Click here to learn about how I got into software development.
        </button>
        {infoToggle && <p>Hi</p>}
      </div> */}
    </Layout>
  )
}

export default About

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(filter: { frontmatter: { template: { eq: "about" } } }) {
      edges {
        node {
          html
          frontmatter {
            title
            template
          }
        }
      }
    }
  }
`
