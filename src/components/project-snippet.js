import React from "react"
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
      <li
        css={css`
          margin: 0 2rem 0 0;
        `}
      >
        Github: <a href={`${project.github}`}>Link</a>
      </li>
      {project.website && (
        <li>
          Website: <a href={`${project.website}`}>Link</a>
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
