#### Media Type formats

Media type formats can be set using `mediaType: { format }` on every request.

Example: retrieve the raw content of a `package.json` file

```js
const { data } = await octokit.rest.repos.getContent({
  mediaType: {
    format: 'raw',
  },
  owner: 'octocat',
  repo: 'hello-world',
  path: 'package.json',
});
console.log('package name: %s', JSON.parse(data).name);
```

Learn more about [Media type formats](https://docs.github.com/en/rest/overview/media-types).
