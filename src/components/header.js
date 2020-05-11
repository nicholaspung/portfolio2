import React from "react"
import { Link } from "gatsby"
import { css } from "@emotion/core"

const buttonStyles = css`
  background: white;
  border: none;
  border-bottom: 1px solid black;
  cursor: pointer;
  margin: 0.5rem;
  &:hover {
    color: blue;
  }
`

const liStyles = css`
  margin: 1rem;
`

const linkStyles = css`
  box-shadow: none;
`

const Header = ({ title }) => (
  <header
    css={css`
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 2rem 0;
    `}
  >
    <h3
      css={css`
        flex: 1 0 50%;
        margin: 0;
      `}
    >
      <Link
        to={`/`}
        css={css`
          color: black;
          text-decoration: none;
          border-bottom: 1px solid black;
          &:hover {
            color: blue;
          }
        `}
      >
        {title}
      </Link>
    </h3>
    <ul
      css={css`
        list-style: none;
        flex: 1 0 50%;
        display: flex;
        justify-content: space-around;
        margin: 0;
      `}
    >
      <li css={liStyles}>
        <Link to={`/about`} css={linkStyles}>
          <button css={buttonStyles}>About Me</button>
        </Link>
      </li>
      <li css={liStyles}>
        <Link to={`/blog`} css={linkStyles}>
          <button css={buttonStyles}>Blog</button>
        </Link>
      </li>
    </ul>
  </header>
)

export default Header
