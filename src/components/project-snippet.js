import React from "react"
import { Link } from "gatsby"
import { css } from "@emotion/core"

const ProjectSnippet = ({ project }) => (
  <div>
    <h3
      css={css`
        margin: 0;
      `}
    >
      {project.title}
    </h3>
    <p
      css={css`
        font-size: 0.75rem;
        color: grey;
        margin-bottom: 0.5rem;
      `}
    >
      {project.date}
    </p>
    <p>{project.description}</p>
    <ul
      css={css`
        display: flex;
        flex-direction: row;
        list-style: none;
        margin: 0;
      `}
    >
      {typeof project.github === "string" ? (
        <li
          css={css`
            margin: 0 2rem 0 0;
          `}
        >
          Github:{" "}
          <a
            href={`${project.github}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Link
          </a>
        </li>
      ) : (
        <>
          <li
            css={css`
              margin: 0 2rem 0 0;
            `}
          >
            Github - Front End:{" "}
            <a
              href={`${project.github[0]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Link
            </a>
          </li>
          <li
            css={css`
              margin: 0 2rem 0 0;
            `}
          >
            Github - Back End:{" "}
            <a
              href={`${project.github[1]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Link
            </a>
          </li>
        </>
      )}
      {project.website && (
        <li
          css={css`
            margin: 0 2rem 0 0;
          `}
        >
          Website:{" "}
          <a
            href={`${project.website}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Link
          </a>
        </li>
      )}
      {project.slug && (
        <li
          css={css`
            margin: 0 2rem 0 0;
          `}
        >
          Case Study:{" "}
          <Link
            to={`/blog/${project.slug}`}
            css={css`
              box-shadow: 0 1px 0 0 #007acc;
            `}
          >
            Link
          </Link>
        </li>
      )}
    </ul>
    <p
      css={css`
        color: grey;
        font-style: italic;
      `}
    >
      Technologies used:{" "}
      {project.category.reduce((acc, curr) => `${acc}, ${curr}`)}
    </p>
  </div>
)

export default ProjectSnippet
