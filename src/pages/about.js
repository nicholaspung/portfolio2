import React from "react"
import { graphql } from "gatsby"

const About = ({ data }) => {
  const about = data.allMarkdownRemark.edges[0].node
  return (
    <>
      <h3>{about.frontmatter.title}</h3>
      <p dangerouslySetInnerHTML={{ __html: about.html }} />
    </>
  )
}

export default About

export const pageQuery = graphql`
  query {
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
