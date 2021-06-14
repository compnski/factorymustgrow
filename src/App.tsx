import React, {ReactElement, MouseEvent, useRef, useEffect, useState, Dispatch, SetStateAction} from 'react';
import sprite from './icon_sprite.png';
import './icons.scss';
import './App.scss';


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

type ProducerType = 'Assembler'| 'Smelter'| 'Miner'| 'ChemFactory'| 'Refinery'| 'Pumpjack';

type Entity = {
    Name: string,
    Icon: string,
    StackSize: number, 
    StorageUpgradeType: 'Liquid' | 'Solid',
    CapacityUpgradeItems: EntityStack[],
    ResearchUpgradeItems: EntityStack[],
}

type OwnedEntity = {
    Entity: Entity,
    CurrentQuantity: number,
    StorageUpgradeCount: number,    
}

const Assembler: Entity = {
    Name: 'Assembler',
    Icon: 'assembling-machine-1',
    StackSize: 50,
    StorageUpgradeType: 'Solid',
    CapacityUpgradeItems: [],
    ResearchUpgradeItems: [],
}

//Assembler.CapacityUpgradeItems.push({Entity: Assembler as Entity, Count: 1})


const Miner: Entity = {
    Name: 'Miner',
    Icon: 'electric-mining-drill',
    StackSize: 50,
    StorageUpgradeType: 'Solid',
    CapacityUpgradeItems: [{Entity: Assembler, Count: 1}],
    ResearchUpgradeItems: [],
}

const IronOre: Entity = {
    Name: 'Iron Ore',
    Icon: 'iron-ore',
    StackSize: 50,
    StorageUpgradeType: 'Solid',
    CapacityUpgradeItems: [{Entity: Miner, Count: 1}],
    ResearchUpgradeItems: [],
}

const StoneFurnace: Entity = {
    Name: 'Stone Furnace',
    Icon: 'stone-furnace',
    StackSize: 50,
    StorageUpgradeType: 'Solid',
    CapacityUpgradeItems: [{Entity: Assembler, Count: 1}],
    ResearchUpgradeItems: [],
}

const IronPlate: Entity = {
    Name: 'Iron Plate',
    Icon: 'iron-plate',
    StackSize: 50,
    StorageUpgradeType: 'Solid',
    CapacityUpgradeItems: [{Entity: StoneFurnace, Count: 1}],
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

const GlobalEntities: {[name: string]: number} = {
    'Iron Ore': 100,
};


type Action = {
    type: 'Produce' | 'AddProducer' | 'RemoveProducer' | 'AddProducerCapacity' | 'RemoveProducerCapacity' | 'ResearchUpgrade'
    payload: number
}



type State = {
    EntityCounts: {[name: string]: number}
    EntityProducers: {[name: string]: ProducingEntity} 
    
}

/* function entityCountReducer(state: State, action: Action): State {
 * 
 *     const globalEntityCount = function(e:Entity):number {
 *         return state.EntityCounts[e.Name] || 0
 *     }
 * 
 *     const updateGlobalEntityCount = function(e:Entity, delta:number):void {
 *         state.EntityCounts[e.Name] = globalEntityCount(e) + delta
 *     }
 * 
 * 
 *     const {type, payload} = action
 *     switch(type) {
 *         case 'Produce':
 *             return {
 *                 ..state
 *             }
 *         case 'AddProducer':
 *         case 'RemoveProducer':
 *         case 'AddProducerCapacity':
 *         case 'RemoveProduceCapacity':
 *         case 'ReserachUpgrade':
 *         default:
 *             return state
 *     }
 * } */

class Actions {
    producer: ProducingEntity;
    setProducer: (p:ProducingEntity)=>void

    globalEntityList: {[key:string]:number};
    setGlobalEntityList: (p:{[key:string]:number})=>void

    globalEntityCount(e:Entity):number {
        return this.globalEntityList[e.Name] || 0
    }

    updateGlobalEntityCount(e:Entity, delta:number):void {
        this.globalEntityList[e.Name] = this.globalEntityCount(e) + delta
        this.setGlobalEntityList({...this.globalEntityList})
    }

    
    constructor(p:ProducingEntity, setProducer:Dispatch<SetStateAction<ProducingEntity>>,
                globalEntityList:{[key:string]:number}, setGlobalEntityList:Dispatch<SetStateAction<{[key:string]:number}>>) {
        this.producer = p
        this.setProducer = setProducer
        this.globalEntityList = globalEntityList
        this.setGlobalEntityList = setGlobalEntityList
    }

    produce(_event:MouseEvent):void {
        // check Input
        this.producer.Recipe.Input.forEach(({Entity, Count})=>{
            if (this.globalEntityCount(Entity) < Count) 
                return
        })
        this.producer.Recipe.Input.forEach(({Entity, Count})=>{
            this.updateGlobalEntityCount(Entity, -Count)
        })
        this.producer.Recipe.Output.forEach(({Entity, Count})=>{
            this.updateGlobalEntityCount(Entity, Count)
        })
        console.log(GlobalEntities)
    }

    addProducer(_event:MouseEvent):void{
        if (this.producer.ProducerCount >= CurrentMaxProducerCount(this.producer)) 
            return
        this.producer.ProducerCount++;
        this.setProducer({...this.producer})
        console.log(this.producer)
    }

    removeProducer(_event:MouseEvent):void{
        if (this.producer.ProducerCount <= 0)
            return
        this.producer.ProducerCount--;
        this.setProducer({...this.producer})
    }

    addProducerCapacity(_event:MouseEvent):void {
        
    }
    removeProducerCapacity(_event:MouseEvent):void {
    }

}

type CardProps = {
    producer: ProducingEntity,
    globalEntities: {[key:string]:number}
    setGlobalEntities:Dispatch<SetStateAction<{[key:string]:number}>>
}

export const Card = ({ producer, globalEntities, setGlobalEntities }: CardProps) =>{
    let [producerState, setProducer] = useState(producer)
    let actions = new Actions(producerState, setProducer, globalEntities, setGlobalEntities)
    return <div className="Producer">
<div className="title"><span >{producer.Recipe.Name} </span></div>
<div className="infoRow">
<div onClick={actions.produce.bind(actions)} className={producer.Recipe.Icon + ' icon clickable'}/>
<div className="rate">{rateToTime(CurrentProducerRate(producer))}</div>
<div className="plusMinus">
<span onClick={actions.addProducer.bind(actions)} className="clickable">+</span>
<span onClick={actions.removeProducer.bind(actions)} className="clickable">-</span>
</div>
<span className={`icon producerTypeIcon ${ProducerIcon(producer)}`}/>
<div className="producerCount">
<span className="currentCapacity">{producerState.ProducerCount}</span>
<span>/</span>

<span className="maxCapacity">{CurrentMaxProducerCount(producer)}</span>
</div>
<div className="plusMinus maxCapacity">
<span onClick={actions.addProducerCapacity.bind(actions)} className="clickable">+</span>
<span onClick={actions.removeProducerCapacity.bind(actions)} className="clickable">-</span>
</div>
<div className="filler"/>
<div className="icon space-science-pack clickable"/>
</div>
<div className="infoRow">
<div className="count">{actions.globalEntityCount(producer.Recipe.Output[0].Entity)}</div>
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
    const [globalEntities, setGlobalEntities] = useState<{[key:string]:number}>({})
    return (
        <div className="App">
            return <Card producer={IronOreProducer} globalEntities={globalEntities} setGlobalEntities={setGlobalEntities}/>
            return <Card producer={IronPlateProducer} globalEntities={globalEntities} setGlobalEntities={setGlobalEntities}/>
        </div>
    );
}

export default App;
