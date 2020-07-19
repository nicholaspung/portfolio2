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
    border-bottom: 0;
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
      align-items: center;
      margin: 2rem 0;
      flex-direction: column;
      @media only screen and (min-width: 700px) {
        flex-direction: row;
      }
    `}
  >
    <h3
      css={css`
        ${"" /* flex: 1 0 25%; */}
        flex: 1 0 50%;
        margin: 0;
      `}
    >
      <Link
        to={`/`}
        css={css`
          color: black;
          text-decoration: none;
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
        ${"" /* flex: 1 0 75%; */}
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
      {/* <li css={liStyles}>
        <Link to={`/today-i-learned`} css={linkStyles}>
          <button css={buttonStyles}>Today I Learned</button>
        </Link>
      </li>
      <li css={liStyles}>
        <Link to={`/book-review`} css={linkStyles}>
          <button css={buttonStyles}>Book Review</button>
        </Link>
      </li> */}
      <li css={liStyles}>
        <Link to={`/blog`} css={linkStyles}>
          <button css={buttonStyles}>Blog</button>
        </Link>
      </li>
    </ul>
  </header>
)

export default Header
