"use client"
import { Component } from "react"

export class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) return this.props.fallback ?? (
      <div className="card p-8 text-center animate-fade-up">
        <p style={{ color: "var(--color-danger)" }}>Something went wrong</p>
        <button className="btn-ghost" style={{ marginTop: "12px" }}
          onClick={() => this.setState({ error: null })}>
          Try again
        </button>
      </div>
    )
    return this.props.children
  }
}
