import React from "react"
import { Link } from "gatsby"
import { css } from "@emotion/core"

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
      <li
        css={css`
          margin: 0;
        `}
      >
        <Link to={`/about`}>
          <button
            css={css`
              background-color: white;
              border: none;
              border-bottom: 1px solid black;
            `}
          >
            About Me
          </button>
        </Link>
      </li>
      <li
        css={css`
          margin: 0;
        `}
      >
        <Link to={`/blog`}>
          <button
            css={css`
              background-color: white;
              border: none;
              border-bottom: 1px solid black;
            `}
          >
            Blog
          </button>
        </Link>
      </li>
    </ul>
  </header>
)

export default Header
