// Styles
import 'mini.css/dist/mini-dark.css';

// Other imports
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import FrayToolsPluginCore from '@fraytools/plugin-core';
import MyMetadataDefinitionPlugin from './MyExampleMetadataDefinitionPlugin';
import { IManifestJson } from '@fraytools/plugin-core/lib/types';
import { IFraymakersMetadataConfig } from './types';

// const semverCompare = require('semver-compare');

declare var MANIFEST_JSON:IManifestJson;

// Informs FrayToolsPluginCore the default config metadata for MyMetadataDefinitionPlugin when it first gets initialized
FrayToolsPluginCore.PLUGIN_CONFIG_METADATA_DEFAULTS = {
    version: MANIFEST_JSON.version
  };
  
  FrayToolsPluginCore.migrationHandler = (configMetadata) => {
    // Compare configMetadata.version here with your latest manifest version and perform any necessary migrations for compatibility
  };
  FrayToolsPluginCore.setupHandler = (props) => {
    // Create a new container for the plugin
    var appContainer = document.createElement('div');
    appContainer.className = 'MyMetadataDefinitionPluginWrapper';
    document.body.appendChild(appContainer);
  
    // Load the component with its props into the document body
    ReactDOM.render(<MyMetadataDefinitionPlugin {...props}/>, appContainer);
  };