import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  D3DragEvent,
  Selection,
  Simulation,
  drag,
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  scaleLinear,
  select,
  zoom,
} from 'd3';
import { SimNode } from './node';
import { SimLink } from './link';

@Component({
  selector: 'app-network-graph',
  standalone: true,
  imports: [],
  templateUrl: './network-graph.component.html',
  styleUrl: './network-graph.component.scss',
})
export class NetworkGraphComponent implements OnInit, OnChanges {
  @Input() nodes!: SimNode[];
  @Input() links!: SimLink[];
  private simulation: Simulation<SimNode, SimLink> = forceSimulation();

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['nodes'].isFirstChange()) {
      select("#net-graph").selectChild().selectChildren().remove()
      this.initializeSim();
    }
  }

  ngOnInit(): void {
    this.initializeSim();
  }

  initializeSim = () => {
    const color = scaleLinear(
      [0, 50, 100],
      ['rgb(170, 0, 0)', 'rgb(245, 210, 0)', 'rgb(0, 170, 0)'],
    );

    this.simulation = forceSimulation<SimNode, SimLink>()
      .nodes(this.nodes)
      .force(
        'link',
        forceLink<SimNode, SimLink>(this.links).id((node) => node.id),
      )
      .force(
        'charge',
        forceManyBody<SimNode>().strength((node) => {
          let charge = -400 * Math.max(1, Math.log(node.r));
          if (node.group === 0) {
            charge = 10 * charge;
          }

          return charge;
        }),
      )
      .force(
        'collide',
        forceCollide<SimNode>()
          .radius((node) => Math.log(Math.max(node.r, 5)) * 10 * 1.5) //radius * 1.5
          .iterations(3),
      )
      .force('center', forceCenter().strength(1))
      .force('x', forceX())
      .force('y', forceY())
      .velocityDecay(0.9);

    const svg: Selection<SVGSVGElement, unknown, HTMLElement, any> = select<
      SVGSVGElement,
      unknown
    >('#net-graph');

    const rootGroup = svg.selectChild();

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        const zoomState = event.transform;
        rootGroup.attr('transform', zoomState);
      });
    svg.call(zoomBehavior);

    const link = rootGroup
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .selectAll('line')
      .data(this.links!)
      .join('line');

    const node = rootGroup
      .append('g')
      .selectAll('g')
      .data(this.nodes!)
      .enter()
      .append('g');

    //Node circle
    const circle = node
      .append('circle')
      .attr('r', (node) => Math.log(Math.max(node.r, 5)) * 10)
      .attr('fill', (node) => color(node.fill))
      .attr('cursor', 'pointer')
      .attr("stroke", (node) => node.group === 0 ? "black" : "none" )
      .attr("stroke-width", (node) => node.group === 0 ? "2" : "none" );

    //Node name
    node
      .append('text')
      .text((node) => node.id)
      .attr('text-anchor', 'middle')
      .attr('y', (node) => Math.log(Math.max(node.r, 5)) * 10 + 15)
      .attr('font-family', 'Space Grotesk')
      .attr('pointer-events', 'none');

    //Node fill
    node
      .append('text')
      .text((node) => `${Math.round(node.fill)}%`)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-family', 'IBM Plex Sans')
      .attr('font-size', (node) => Math.log(Math.max(node.r, 8)) * 7)
      .attr('fill', 'white')
      .attr('pointer-events', 'none');

    let dragstarted = (
      event: D3DragEvent<SVGCircleElement, SimNode, SimNode>,
    ) => {
      if (!event.active) this.simulation.alphaTarget(0.9).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    };
    let dragged = (
      event: d3.D3DragEvent<SVGCircleElement, SimNode, SimNode>,
    ) => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    };

    let dragended = (
      event: d3.D3DragEvent<SVGCircleElement, SimNode, SimNode>,
    ) => {
      if (!event.active) this.simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    };

    circle.call(
      drag<SVGCircleElement, SimNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended),
    );

    this.simulation.on('tick', () => {
      link
        .attr('x1', (l) =>
          typeof l.source !== 'number' && typeof l.source !== 'string'
            ? l.source.x!
            : null,
        )
        .attr('y1', (l) =>
          typeof l.source !== 'number' && typeof l.source !== 'string'
            ? l.source.y!
            : null,
        )
        .attr('x2', (l) =>
          typeof l.target !== 'number' && typeof l.target !== 'string'
            ? l.target.x!
            : null,
        )
        .attr('y2', (l) =>
          typeof l.target !== 'number' && typeof l.target !== 'string'
            ? l.target.y!
            : null,
        );

      node.attr('transform', (node) => `translate(${node.x}, ${node.y})`);
    });
  };
}
