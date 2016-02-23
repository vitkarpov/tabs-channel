# Tabs Channel

TabsChannel is a JavaScript library which provides a channel between diffirent tabs (windows) for documents from different domains (dealing with security issues).

So, A.com and B.com are opened in different tabs and want to communication to each other.

A.com:

```js
var proxy = new TabsChannel({
    id: 'should-be-the-same-for-different-tabs'
});

proxy.send('hello from A!');
```

B.com:

```js
var proxy = new TabsChannel({
    id: 'should-be-the-same-for-different-tabs'
});

proxy.onReceive = function(message) {
    console.log(message);
};

// prins "hello from A!" when A.com sends a message
```

A.com sens messages to B.com and the one gets them and can handle. Channel works in both directions.

[**How it works**](https://medium.com/front-end-hacking/communication-between-tabs-43a35725edfe)
