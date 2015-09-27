# <x-query>

x-query allow the users to build your own logic query

A x-query component using [polymer 1.0](http://polymer-project.org).

![Demo]( https://cloud.githubusercontent.com/assets/1040010/9999679/11efd212-606e-11e5-857d-8a79cb15a5d2.png)


## Usage

1. Create Circles
```
<x-query id='1' ></x-query>
```

And enjoy :)

## Atributtes


### x-query
Attribute     | Options     | Default              | Description
---           | ---         | ---                  | ---
`id`          | *String*    | ''                   | The `id` attribute sets the identifier value.
`mysql`       | *Boolean*   | false                | at mountQuery the x-query send the mysql where clause


##Styling

### x-query

Custom property | Description | Default
----------------|-------------|----------
`--x-query-background-color` | lines color  | `#00ad99`
`--x-query-background-color-error` | lines color when something is wrong  | `#f04b57`

##Events

### x-query

Event | Description
----------------|-------------
`x-query-ready` | this circle was removed


## license

[MIT License](https://github.com/dreyescat/rating-element/blob/master/LICENSE.md)
