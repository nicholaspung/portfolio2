import React from "react"
import { Link } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ProjectSnippet from "../components/project-snippet"

import projects from "../../content/projects"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Portfolio and Mumblings" />
      <Bio />
      <h3 style={{ borderBottom: "1px solid black" }}>Projects</h3>
      {projects
        .filter(project => !project.draft)
        .map(project => (
          <ProjectSnippet project={project} />
        ))}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
