import React, { ReactElement, MouseEvent, useRef, useEffect, useState, Dispatch, SetStateAction, useReducer} from 'react';
import sprite from './icon_sprite.png';
import './icons.scss';
import './App.scss';
import { Map } from 'immutable';


type EntityStack = {
    Entity: Entity,
    Count: number,
}

type Recipe = {
    Name: string,
    Icon: string,
    ProducerType:  ProducerType,
    DurationSeconds: number,
    Input: EntityStack[],
    Output: EntityStack[],
}

//enum ProducerType {}

const ProducerTypeIconMap: {[key: string]:string} = {
    'Assembler': 'assembling-machine-1',
    'Smelter' : 'stone-furnace',
    'Miner' : 'electric-mining-drill',
    'ChemFactory':'',
    'Refinery':'',
    'Pumpjack':'',
}


function ProducerTypeUpgradeCost(type:ProducerType, _upgradeLevel:number):EntityStack[] {
    switch(type) {
        case 'Assembler':
            return [{Entity:Assembler, Count:1}]
        case 'Smelter' : 
            return [{Entity:StoneFurnace, Count:1}]
        case 'Miner' :
            return [{Entity:Miner, Count:1}]         
        case 'ChemFactory':
            return []
        case 'Refinery':
            return []
        case 'Pumpjack':
            return []
    }
}

function ProducerTypeCapacityUpgradeCost(type:ProducerType, _upgradeLevel:number):EntityStack[] {
    switch(type) {
        case 'Assembler':
        case 'Smelter':
        case 'Miner':
            return [{Entity:YellowBelt, Count:1}]
        case 'ChemFactory':
            return []
        case 'Refinery':
            return []
        case 'Pumpjack':
            return []
    }
}



type ProducerType = 'Assembler'| 'Smelter'| 'Miner'| 'ChemFactory'| 'Refinery'| 'Pumpjack';

type Entity = {
    Name: string,
    Icon: string,
    StackSize: number, 
    StorageUpgradeType: 'Liquid' | 'Solid',
    ResearchUpgradeItems: EntityStack[],
}

const Assembler: Entity = {
    Name: 'Assembler',
    Icon: 'assembling-machine-1',
    StackSize: 50,
    StorageUpgradeType: 'Solid',
    ResearchUpgradeItems: [],
}


const YellowBelt: Entity = {
    Name: 'Yellow Belt',
    Icon: 'transport-belt',
    StackSize: 100,
    StorageUpgradeType: 'Solid',
    ResearchUpgradeItems: [],
}


const Miner: Entity = {
    Name: 'Miner',
    Icon: 'electric-mining-drill',
    StackSize: 50,
    StorageUpgradeType: 'Solid',
    ResearchUpgradeItems: [],
}

const IronOre: Entity = {
    Name: 'Iron Ore',
    Icon: 'iron-ore',
    StackSize: 50,
    StorageUpgradeType: 'Solid',
    ResearchUpgradeItems: [],
}

const StoneFurnace: Entity = {
    Name: 'Stone Furnace',
    Icon: 'stone-furnace',
    StackSize: 50,
    StorageUpgradeType: 'Solid',
    ResearchUpgradeItems: [],
}

const IronPlate: Entity = {
    Name: 'Iron Plate',
    Icon: 'iron-plate',
    StackSize: 50,
    StorageUpgradeType: 'Solid',
    ResearchUpgradeItems: [],
}

const IronOreRecipe: Recipe = {
    Name: 'Iron Ore',
    Icon: 'iron-ore',
    DurationSeconds: 1,
    ProducerType: 'Miner',
    Input: [],
    Output: [{
        Entity: IronOre,
        Count: 1,
    }]    
}

const IronPlateRecipe: Recipe = {
    Name: 'Iron Plate',
    Icon: 'iron-plate',
    DurationSeconds: 1,
    ProducerType: 'Smelter',
    Input: [{
        Entity: IronOre,
        Count: 1,
    }],
    Output: [{
        Entity: IronPlate,
        Count: 1,
    }]    
}


interface ProducingEntity {
    Recipe: Recipe;
    ProducerCount: number;
    ProducerCapacityUpgradeCount: number;
    ProducerMaxCapacityUpgradeCount: number;
    ResearchUpgradeCount: number;
//    CurrentRate():number;
//    CurrentMaxProducerCount():number;
}

const rateToTime = function(rate:number):string {
    return `${rate}/m`;
}

const CurrentProducerRate = function(p:ProducingEntity):number  {
    return (1 / p.Recipe.DurationSeconds) * p.ProducerCount
}
const CurrentMaxProducerCount = function(p:ProducingEntity):number  {return 50} 

const ProducerIcon = (p:ProducingEntity):string => ProducerTypeIconMap[p.Recipe.ProducerType]

type RecipeProps ={
    recipe: Recipe
}

const RecipeDisplay = ({ recipe }: RecipeProps)  => <div className="recipe">
{recipe.Input.map((x, i) =>
    <span key={i}>
        <span>{x.Count}</span>
        <div  className={`icon ${x.Entity.Icon}`}/>
    </span>
)}
<span>=</span>
{recipe.Output.map((x, i) =>
    <span key={i} >
        <span>{x.Count}</span>
        <div className={`icon ${x.Entity.Icon}`}/>
    </span>
)}
</div>



var IronOreProducer : ProducingEntity =  {
    Recipe: IronOreRecipe,
    ProducerCount: 0,
    ProducerCapacityUpgradeCount: 0,
    ProducerMaxCapacityUpgradeCount: 0,
    ResearchUpgradeCount: 0,
}

var IronPlateProducer : ProducingEntity =  {
    Recipe: IronPlateRecipe,
    ProducerCount: 0,
    ProducerCapacityUpgradeCount: 0,
    ProducerMaxCapacityUpgradeCount: 0,
    ResearchUpgradeCount: 0,
}

type Action = {
    type: 'Produce' | 'AddProducer' | 'RemoveProducer' | 'AddProducerCapacity' | 'RemoveProducerCapacity' | 'ResearchUpgrade'
    producer: ProducingEntity
}



type State = {
    EntityCounts: Map<string, number>
    EntityStorageCapacityUpgrades: Map<string, number>
    EntityProducers: Map<string, ProducingEntity>
}

const initialState:State = {
    EntityCounts:Map(),
    EntityStorageCapacityUpgrades: Map(),
    EntityProducers: Map({
        'Iron Ore': IronOreProducer,
        'Iron Plate': IronPlateProducer, 
    }),
}


function entityCountReducer(state: State, action: Action): State {
    console.log('Got ',action,' for ', state)

    
    const globalEntityCount = function(ec:Map<string, number>, e:Entity):number {
        return ec.get(e.Name) || 0
    }
    

    const entityStorageCapacity = function(es:Map<string, number>, e:Entity):number {
        return e.StackSize * (1+(es.get(e.Name)||0))
    }
    
    const ensureSufficientEntitiesExists = function(ec:Map<string,number>, stacks:EntityStack[]):boolean {
        let ok = true
        stacks.forEach(({Entity, Count})=>{
            console.log(Entity.Name, globalEntityCount(ec, Entity), Count)
            if (globalEntityCount(ec, Entity) < Count) 
               ok = false
        })
        return ok
    }

    const ensureSufficientStorageExists = function(ec:Map<string,number>, es:Map<string, number>, stacks:EntityStack[]):boolean {
        stacks.forEach(({Entity, Count})=>{
            if (globalEntityCount(ec, Entity) + Count >= entityStorageCapacity(es, Entity)) 
                return false
        })
        return true
    }
    
    const checkAndConsumeEntities = function(ec:Map<string, number>, stacks:EntityStack[]):[Map<string, number>, boolean] {
        if (!ensureSufficientEntitiesExists(ec, stacks))
            return [ec, false]
        const returnMap = ec.withMutations((ec:Map<string,number>) => {
            stacks.forEach(({Entity, Count})=>{
                ec.update(Entity.Name, v => (v || 0) - Count)
            })
        })
        return [returnMap, true]
    }

    const checkAndProduceEntities = function(ec:Map<string, number>, es:Map<string, number>, stacks:EntityStack[]):[Map<string, number>, boolean] {
        if (!ensureSufficientStorageExists(ec, es, stacks))
            return [ec, false]
        const returnMap = ec.withMutations((ec:Map<string,number>) => {
            stacks.forEach(({Entity, Count})=>{
                ec.update(Entity.Name, v => (v || 0)  + Count)
            })
        })
        return [returnMap, true]
    }

    const checkAndRefundEntities = function(ec:Map<string, number>, es:Map<string, number>, stacks:EntityStack[]):boolean {
        if (!ensureSufficientStorageExists(ec, es, stacks))
            return false
        stacks.forEach(({Entity, Count})=>{
            //updateGlobalEntityCount(Entity, Count)
        })
        return true

    }
    const {type, producer} = action
    let ec = state.EntityCounts
    let es = state.EntityStorageCapacityUpgrades
    let ok:boolean
    switch(type) {
        case 'Produce':
            [ec, ok] = checkAndConsumeEntities(ec, producer.Recipe.Input)
            if (ok)
                [ec, ok] = checkAndProduceEntities(ec, es, producer.Recipe.Output)
            console.log(ec)
            if (ok)
                return {
                    ...state,
                    EntityCounts: ec,
                }
            else
                return state
        case 'AddProducer':
            if (producer.ProducerCount > CurrentMaxProducerCount(producer) )
                return state
            if (checkAndConsumeEntities(ec, ProducerTypeUpgradeCost(producer.Recipe.ProducerType, producer.ProducerCount)))
                producer.ProducerCount++;
            return { ...state}
        case 'RemoveProducer':
            if (producer.ProducerCount <= 0) 
                return state
            if (checkAndRefundEntities(ec, es, ProducerTypeUpgradeCost(producer.Recipe.ProducerType, producer.ProducerCount)))
                producer.ProducerCount--;
            return { ...state}
        case 'AddProducerCapacity':
            if (checkAndConsumeEntities(ec, ProducerTypeCapacityUpgradeCost(producer.Recipe.ProducerType, producer.ProducerCapacityUpgradeCount)))
                producer.ProducerCapacityUpgradeCount++
            return {...state}
        case 'RemoveProducerCapacity':
            if (producer.ProducerCapacityUpgradeCount++ <= 0)
                return state
            if (checkAndRefundEntities(ec, es, ProducerTypeCapacityUpgradeCost(producer.Recipe.ProducerType, producer.ProducerCapacityUpgradeCount)))
                producer.ProducerCapacityUpgradeCount--
                return {...state}
        case 'ResearchUpgrade':
            return state
        default:
            return state
    }
}

type CardProps = {
    producer?: ProducingEntity,
    dispatch(a:Action):void
    globalEntityCount:(e:Entity)=>number
}

export const Card = ({ producer, dispatch, globalEntityCount }: CardProps) =>{
    if (!producer)
        return <div className="NoProducer"/>
    return <div className="Producer">
        <div className="title"><span >{producer.Recipe.Name} </span></div>
        <div className="infoRow">
            <div onClick={()=>{dispatch({producer: producer, type:'Produce'}); console.log(globalEntityCount(IronOre))}} className={producer.Recipe.Icon + ' icon clickable'}/>
            <div className="rate">{rateToTime(CurrentProducerRate(producer))}</div>
            <div className="plusMinus">
                <span onClick={()=>dispatch({producer: producer, type:'AddProducer'})} className="clickable">+</span>
                <span onClick={()=>dispatch({producer: producer, type:'RemoveProducer'})} className="clickable">-</span>
            </div>
            <span className={`icon producerTypeIcon ${ProducerIcon(producer)}`}/>
            <div className="producerCount">
                <span className="currentCapacity">{producer.ProducerCount}</span>
                <span>/</span>

                <span className="maxCapacity">{CurrentMaxProducerCount(producer)}</span>
            </div>
            <div className="plusMinus maxCapacity">
                <span onClick={()=>dispatch({producer: producer, type:'AddProducerCapacity'})} className="clickable">+</span>
                <span onClick={()=>dispatch({producer: producer, type:'RemoveProducerCapacity'})} className="clickable">-</span>
            </div>
            <div className="filler"/>
            <div className="icon space-science-pack clickable"/>
        </div>
        <div className="infoRow">
            <div className="count">{globalEntityCount(producer.Recipe.Output[0].Entity)}</div>
            {producer.Recipe.Input.length > 0 ? <RecipeDisplay recipe={producer.Recipe}/>:<div/>}
        </div>
    </div>
}
/* Thanks Dan Abramov  for useInterval hook
   https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
function useInterval(callback: ()=>void, delay:number) {
    const savedCallback= useRef<()=>void> ();

    useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
      function tick() {
          if (savedCallback.current != null) 
              savedCallback.current();
    }
    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}


function App() {
    const [state, dispatch] = useReducer(entityCountReducer, initialState)
    const globalEntityCount = (e:Entity):number =>
        state.EntityCounts.get(e.Name) || 0
        return (
            <div className="App">
                return <Card producer={state.EntityProducers.get('Iron Ore')} dispatch={dispatch} globalEntityCount={globalEntityCount}/>
                return <Card producer={state.EntityProducers.get('Iron Plate')} dispatch={dispatch} globalEntityCount={globalEntityCount}/>
            </div>
        );
}

export default App;
