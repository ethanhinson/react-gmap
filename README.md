# React Gmaps

Provide a component, state management, and effect for rendering a list of markers on a map.

### TODOS:

- [x] Create a basic map component that accepts props
- [x] Provide a state reducer and context so the implementors can access the `google.maps.map` object.
- [x] Accept a list of markers
- [x] `useEffect` for autozooming on marker update/load
- [x] Memoize marker creation.
- [ ] Implement `MarkerClusterer`

## Usage

We use a custom Context hook to provide state information about the map instance.

```
<GmapProvider defaultState={{
  map: null,
}}>
  <Map apiKey="YOURKEY" />
</GmapProvider>
```

There is a _very_ simple test application in `demo/index.html`. It loads `index.jsx`. You can run the 
webpack dev server with:

`$ npm run start`

Test with:

`$ npm run test`
