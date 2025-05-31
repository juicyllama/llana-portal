import { Operator } from '~/types/llana'

export const operators = [{
    operator: Operator.equals,
    friendly: 'Equals',
    icon: 'ph:equals',
    symbol: '='
},{
    operator: Operator.not_equals,
    friendly: 'Not Equals',
    icon: 'ph:not-equals',
     symbol: '!='
},{
    operator: Operator.gt,
    friendly: 'Greater Than',
    icon: 'ph:greater-than',
     symbol: '>'
},{
    operator: Operator.gte,
    friendly: 'Greater Than or Equals',
    icon: 'ph:greater-than-or-equal',
    symbol: '>='
},{
    operator: Operator.lt,
    friendly: 'Less Than',
    icon: 'ph:less-than',
    symbol: '<'
},{
    operator: Operator.lte,
    friendly: 'Less Than or Equals',
    icon: 'ph:less-than-or-equal',
    symbol: '<='
},{
    operator: Operator.like,
    friendly: 'Like',
    icon: 'ph:approximate-equals',
    symbol: '%'
},{
    operator: Operator.not_like,
    friendly: 'Not Like',
    icon: 'ph:exclamation-mark',
    symbol: '!%'
},{
    operator: Operator.in,
    friendly: 'In',
    icon: 'ph:selection-background',
    symbol: '[]'
},{
    operator: Operator.not_in,
    friendly: 'Not In',
    icon: 'ph:selection-foreground',
    symbol: '![]'
},{
    operator: Operator.null,
    friendly: 'Is Null',
    icon: 'ph:square',
    symbol: '!'
},{
    operator: Operator.not_null,
    friendly: 'Is Not Null',
    icon: 'ph:check-square',
    symbol: '!!'
},{
    operator: Operator.search,
    friendly: 'Search',
    icon: 'ph:magnifying-glass-plus',
    symbol: '??'
}]