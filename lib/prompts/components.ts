export const getComponents = (uiType: string): string => {
  const components: Record<string, string[]> = {
    'shadcn-react': [
      'Accordion', 'Alert', 'AlertDialog', 'AspectRatio', 'Avatar', 'Badge', 'Button', 
      'Calendar', 'Card', 'Carousel', 'Checkbox', 'Collapsible', 'Combobox', 'Command', 
      'ContextMenu', 'Dialog', 'Drawer', 'DropdownMenu', 'Form', 'HoverCard', 'Input', 
      'Label', 'Menubar', 'NavigationMenu', 'Pagination', 'Popover', 'Progress', 'RadioGroup', 
      'ScrollArea', 'Select', 'Separator', 'Sheet', 'Skeleton', 'Slider', 'Switch', 'Table', 
      'Tabs', 'Textarea', 'Toast', 'Toggle', 'Tooltip'
    ],
    'mui': [
      'Accordion', 'Alert', 'AppBar', 'Avatar', 'Backdrop', 'Badge', 'BottomNavigation', 
      'Box', 'Breadcrumbs', 'Button', 'ButtonGroup', 'Card', 'Checkbox', 'Chip', 'CircularProgress', 
      'Container', 'Dialog', 'Divider', 'Drawer', 'Fab', 'FormControl', 'FormGroup', 'Grid', 
      'Icon', 'IconButton', 'LinearProgress', 'Link', 'List', 'Menu', 'Paper', 'Popover', 
      'Progress', 'Radio', 'Select', 'Slider', 'Snackbar', 'Stepper', 'Switch', 'Table', 
      'Tabs', 'TextField', 'Toolbar', 'Tooltip', 'Typography'
    ],
    'ant-design': [
      'Affix', 'Alert', 'Anchor', 'AutoComplete', 'Avatar', 'BackTop', 'Badge', 'Breadcrumb', 
      'Button', 'Calendar', 'Card', 'Carousel', 'Cascader', 'Checkbox', 'Col', 'Collapse', 
      'Comment', 'ConfigProvider', 'DatePicker', 'Descriptions', 'Divider', 'Drawer', 
      'Dropdown', 'Empty', 'Form', 'Grid', 'Image', 'Input', 'InputNumber', 'Layout', 
      'List', 'Menu', 'Message', 'Modal', 'Notification', 'PageHeader', 'Pagination', 
      'Popconfirm', 'Popover', 'Progress', 'Radio', 'Rate', 'Result', 'Row', 'Select', 
      'Skeleton', 'Slider', 'Space', 'Spin', 'Statistic', 'Steps', 'Switch', 'Table', 
      'Tabs', 'Tag', 'TimePicker', 'Timeline', 'Tooltip', 'Transfer', 'Tree', 'Typography', 
      'Upload'
    ]
  };

  return components[uiType]?.join(', ') || '';
}; 