import {h} from 'preact';
import cN from 'classnames';
import {BasicSection, Header, Section, Footer} from "com/content/basic";

/**
 * Simple section type with optional title and footer
 *
 * @param {object} props
 * @param {any} [props.children]
 * @param {string} [props.class]
 * @param {string} [props.title]
 * @param {string} [props.href]
 * @param {object} [props.footer]
 */
export default function ContentSimple( props ) {
	/* Simple documents have only a single sub-section. For more complicated documents, make your own */
	return (
		<BasicSection {...props} class={cN("-simple", props.class)}>
			{props.title ? <Header title={props.title} href={props.href} /> : null}
			<Section children={props.children} />
			{props.footer ? <Footer {...(props.footer)} /> : null}
		</BasicSection>
	);
}