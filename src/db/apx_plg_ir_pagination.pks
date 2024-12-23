create or replace package apx_plg_ir_pagination is

  -- Author  : JKIESEBRINK
  -- Created : 12/23/2024 17:54:12 AM
  -- Purpose : Oracle APEX Dynamic Action Plug-in

  -- Public function and procedure declarations
  function init(p_dynamic_action in apex_plugin.t_dynamic_action
               ,p_plugin         in apex_plugin.t_plugin) return apex_plugin.t_dynamic_action_render_result;

end apx_plg_ir_pagination;
/