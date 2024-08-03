import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
// Import FrayToolsPluginCore.js and BaseMetadataDefinitionPlugin.js
import './MyExampleMetadataDefinitionPlugin.scss';
import FrayToolsPluginCore from '@fraytools/plugin-core';
import BaseMetadataDefinitionPlugin, { IMetadataDefinitionPluginProps, IMetadataDefinitionPluginState } from '@fraytools/plugin-core/lib/base/BaseMetadataDefinitionPlugin';
import { IManifestJson } from '@fraytools/plugin-core/lib/types';
import { IFraymakersMetadataConfig, IFraymakersMetadataPluginAssetMetadata } from './types';
import { ILibraryAssetMetadata } from '@fraytools/plugin-core/lib/types/fraytools';

const semverCompare = require('semver-compare');

declare var MANIFEST_JSON:IManifestJson;

interface IFraymakersMetadataProps extends IMetadataDefinitionPluginProps {
  configMetadata:IFraymakersMetadataConfig;
  assetMetadata: IFraymakersMetadataPluginAssetMetadata;
}
interface IFraymakersMetadataState extends IMetadataDefinitionPluginState {

}
/**
 * Example view for the metadata definition plugin.
 * Note: Types plugins run hidden in the background and thus will not be visible.
 */
export default class MyMetadataDefinitionPlugin extends BaseMetadataDefinitionPlugin<IFraymakersMetadataProps, IFraymakersMetadataState> {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  /**
   * Force this component to re-render when parent window sends new props
   */
  onPropsUpdated(props) {
    ReactDOM.render(<MyMetadataDefinitionPlugin {...props} />, document.querySelector('.MyMetadataDefinitionPluginWrapper'));
  }

  /**
   * Send metadata definition collection data here. This function will be called automatically when a 'getMetadataDefinitionConfig' message is received via postMessage().
   * @returns 
   */
  onMetadataDefinitionRequest() {
    // Return metadata definitions
    FrayToolsPluginCore.sendMetadataDefinitions([
      {
        metadataOwnerTypes: ['IMAGE_LAYER_METADATA', 'IMAGE_KEYFRAME_METADATA', 'IMAGE_SYMBOL_METADATA', 'SPRITE_ENTITY_ASSET_METADATA'],
        fields: [{
          name: 'myCustomDropdown',
          label: 'My Custom Dropdown',
          type: 'DROPDOWN',
          defaultValue: null,
          options: [
            { label: 'Option 1', value: 1 },
            { label: 'Option 2', value: 2 },
            { label: 'Option 3', value: 3 }
          ],
          dependsOn: []
        },{
          name: 'myCustomBoolean',
          label: 'My Custom Boolean',
          type: 'BOOLEAN',
          defaultValue: false,
          dependsOn: []
        },{
          name: 'myCustomTags',
          label: 'My Custom Tags',
          type: 'TAGS',
          defaultValue: [],
          dependsOn: [{
            inputField: 'pluginMetadata[].myCustomDropdown',
            operator: '=',
            inputValue: 2
          }]
        }],
        effects: []
      },
      {
        metadataOwnerTypes: ['FRAME_SCRIPT_KEYFRAME_METADATA'],
        fields: [{
          name: 'myCustomDropdown',
          label: 'My Custom Dropdown',
          type: 'DROPDOWN',
          defaultValue: null,
          dependsOn: [],
          options: [
            { label: 'n/a', value: null },
            { label: 'Write Hello World', value: 'bar' }
          ],
        }],
        effects: [{
          outputField: 'code',
          outputValue: '// Hello world!', // Replace frame scripts on the current keyframe with this string if conditions are met
          dependsOn: [{
            inputField: 'pluginMetadata[].myCustomDropdown', // Note: '[]' is auto-replaced with current plugin id. You could also use '["my.example.metadata.definition.plugin"]', or even other plugin ids.
            operator: '=',
            inputValue: 'bar',
          }]
        }]
      }
    ]);
  }
  /**
   * Send fields to overwrite metadata on the current asset. 
   */
  onAssetMetadataMigrationRequest() {
    var tags = this.props.assetMetadata.tags;
    // We will add a custom tag to the asset using a migration.
    if (this.props.assetMetadata.tags.indexOf('custom') < 0) {
      tags.push('custom');
    } else {
      // Pass null to inform FrayTools no migration is required
      FrayToolsPluginCore.sendAssetMetadataMigrations(null);
      return;
    }
    FrayToolsPluginCore.sendAssetMetadataMigrations({
      tags: tags
    } as ILibraryAssetMetadata);
  }

  render() {
    if (this.props.configMode) {
      // If configMode is enabled, display a different view specifically for configuring the plugin
      return (
        <div style={{ color: '#ffffff', background: '#000000' }}>
          <p>{JSON.stringify(MANIFEST_JSON)}</p>
          <p>Hello world! This is an example configuration view for a Metadata Definition plugin.</p>
          <p>Here you would provide a UI for assigning custom settings to persist between sessions using 'pluginConfigSyncRequest' postMessage() commands sent to the parent window. This data will then be stored within the current FrayTools project settings file.</p>
        </div>
      );
    }

    // Note: MetadataDefinitionPlugins that aren't in config mode run in the background and thus do not display a view while active
      return  <div className="MyMetadataAssetComponent" style={{ color: '#ffffff', background: '#000000' }}>
          <p>Hello world! This is an example configuration view for a Metadata Definition plugin.</p>
          <p>Here you would provide a UI for assigning custom settings to persist between sessions using 'pluginConfigSyncRequest' postMessage() commands sent to the parent window. This data will then be stored within the current FrayTools project settings file.</p>
      </div>
  }
}
