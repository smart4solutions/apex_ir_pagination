create or replace package apx_plg_ir_pagination is

  -- Author  : JKIESEBRINK
  -- Created : 12/23/2024 17:54:12 AM
  -- Purpose : Oracle APEX Dynamic Action Plug-in

  -- Public function and procedure declarations
  function init(p_dynamic_action in apex_plugin.t_dynamic_action
               ,p_plugin         in apex_plugin.t_plugin) return apex_plugin.t_dynamic_action_render_result is
    l_render_result apex_plugin.t_dynamic_action_render_result;
    begin
        l_render_result.javascript_function := 's4s.apex.ir_pagination.initIRPagination';
        l_render_result.ajax_identifier     := apex_plugin.get_ajax_identifier;
        l_render_result.attribute_01        := p_dynamic_action.attribute_01; -- Buttons: Behavior (DISABLE, HIDE)
        l_render_result.attribute_02        := p_dynamic_action.attribute_02; -- Buttons: First page title
        l_render_result.attribute_03        := p_dynamic_action.attribute_03; -- Buttons: First page icon
        l_render_result.attribute_04        := p_dynamic_action.attribute_04; -- Buttons: Last page title
        l_render_result.attribute_05        := p_dynamic_action.attribute_05; -- Buttons: Last page icon

        return l_render_result;
    exception
        when others then
            apex_debug.error('Error in init: ' || sqlerrm);
            raise;
    end init;

end apx_plg_ir_pagination;
/