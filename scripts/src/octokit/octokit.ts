import { Octokit } from '@octokit/rest';
import { PRCommentor } from './commentor';
import { App } from 'octokit';

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const prCommentor = new PRCommentor(
  octokit,
  process.env.PR_NUMBER ? parseInt(process.env.PR_NUMBER) : undefined,
);
