/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import { css } from "@emotion/core"

import { rhythm } from "../utils/typography"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
      github: file(absolutePath: { regex: "/github-logo.png/" }) {
        childImageSharp {
          fixed(width: 25, height: 25) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      linkedin: file(absolutePath: { regex: "/linkedin.png/" }) {
        childImageSharp {
          fixed(width: 25, height: 25) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
          }
        }
      }
    }
  `)

  const { author } = data.site.siteMetadata
  return (
    <div
      css={css`
        display: flex;
        align-items: flex-end;
        margin-bottom: ${rhythm(2.5)};
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-right: ${rhythm(1 / 2)};
        `}
      >
        <Image
          fluid={data.avatar.childImageSharp.fluid}
          alt={author.name}
          style={{
            marginBottom: 0,
            width: "50px",
            height: "50px",
            borderRadius: `100%`,
          }}
          imgStyle={{
            borderRadius: `50%`,
          }}
        />
        <div
          css={css`
            display: flex;
            justify-content: space-around;
            margin: 0.25rem;
            width: 100%;
          `}
        >
          <a
            href="https://github.com/nicholaspung"
            target="_blank"
            rel="noopener noreferrer"
            css={css`
              box-shadow: none;
            `}
          >
            <Image
              fixed={data.github.childImageSharp.fixed}
              alt={`Icons made by <a href="https://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>`}
            />
          </a>
          <a
            href="https://linkedin.com//in/nicholas-pung"
            target="_blank"
            rel="noopener noreferrer"
            css={css`
              box-shadow: none;
            `}
          >
            <Image
              fixed={data.linkedin.childImageSharp.fixed}
              alt={`Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>`}
              style={{ filter: "grayscale(100%)" }}
            />
          </a>
        </div>
      </div>
      <div
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <p
          css={css`
            text-align: center;
            margin-bottom: 0.25rem;
          `}
        >
          Hi{" "}
          <span role="img" aria-label="wave-hands">
            👋
          </span>{" "}
          I'm Nicholas.
        </p>
        <p
          css={css`
            margin: 0;
          `}
        >
          I'm a full-stack developer, who likes to build projects to use
          day-to-day. I'm extremely interested in integrating health with
          software, so my primary focus is on learning how to use hardware and
          software to drive human behavior in a positive direction.
        </p>
      </div>
    </div>
  )
}

export default Bio
