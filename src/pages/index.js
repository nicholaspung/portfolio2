import React from "react"
import { graphql } from "gatsby"

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
      <h2 style={{ borderBottom: "1px solid black" }}>Projects</h2>
      {projects
        .filter(project => !project.draft)
        .sort((a, b) => b.order - a.order)
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
