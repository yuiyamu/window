<script lang="ts">
  type Frame = {
    width: number;
    height: number;
    x: number;
    y: number;
  }

  type Rect = {
    width: number;
    height: number;
  }

  type Titlebar = {
    width: number;
    height: number;
    button: Rect;
    controlBox: Rect;
    gradient: Rect;
  }

  //will determine this later with the image you drag in :p
  let bgFilename = $state("");

  let windowTitle = $state("");
  let windowIcon = $state("/icons/w2k_audio_cd.ico");

  let targetWidth = $state(800);
  let targetHeight = $state(400);
  let isActive = $state(true); //should be able to change this via web tick tick
  let showScrollbar = $state(false);
  let showResize = $state(false);
  let showStatus = $state(false);

  let scale = $state(2);
  const padding = 2;
  const frameSize = 2;
  let width = $derived(targetWidth / scale);
  let height = $derived(targetHeight / scale);
  let windowFrame: Frame = $derived({width, height, x: 0, y: 0});

  let windowContents: Frame = $derived({
    width: windowFrame.width - frameSize * 2 - padding * 2,
    height: windowFrame.height - frameSize * 2 - padding * 2,
    x: frameSize + padding,
    y: frameSize + padding
  });

  const titlebarButtonWidth = 16;
  const titlebarHeight = 18;
  let titlebar: Titlebar = $derived({
    width: windowContents.width,
    height: titlebarHeight,
    button: {
      width: titlebarButtonWidth,
      height: 14
    },
    controlBox: {
      width: titlebarButtonWidth * 3 + padding * 3,
      height: titlebarHeight
    },
    gradient: {
      width: windowContents.width - (titlebarButtonWidth * 3 + padding * 3),
      height: titlebarHeight
    }
  });

  const statusbarHeight = 18;
  const statusbar: Rect = $derived({
    width: windowContents.width,
    height: statusbarHeight
  });

  const windowTextArea: Rect = $derived({
    width: windowContents.width,
    height: showStatus? (windowContents.height - titlebar.height - padding - (statusbar.height + padding)) : (windowContents.height - titlebar.height - padding)
  });

  const scrollbar = $derived({
    width: 16,
    height: windowTextArea.height - frameSize * 2,
    y: frameSize,
    x: windowTextArea.width - frameSize - 16,
    button: {
      width: 16,
      height: 16,
    }
  });

  const resizeGrip: Frame = $derived({
    width: 13,
    height: 13,
    x: windowContents.width - 13,
    y: windowContents.height - 13
  });

  let titleColor = $state("ActiveTitle");
  let titleGradientColor = $state("GradientActiveTitle");
  if (!isActive) {
    titleColor = "InactiveTitle";
    titleGradientColor = "GradientInactiveTitle";
  }

  let inputFiles: FileList = $state()!;
  let imgBase64 = $state("");
  function uploadFile() {
    let file = inputFiles[0];

    const img = new Image(); //making a fake temp object to get dimensions~
    const imgUrl = URL.createObjectURL(file);
    img.onload = function() {
      //also we calculate how much Actual width and height we will need beforehand since :p fuck it i guess
      const windowWidth = frameSize * 2 + padding * 2;
      const windowHeight = frameSize * 2 + padding * 2 + titlebarHeight + padding + (showStatus ? (statusbarHeight + padding) : 0);
      targetWidth = (img.naturalWidth + windowWidth) * scale;
      targetHeight = (img.naturalHeight + windowHeight) * scale;

      bgFilename = `${file.name.replace(/\.[^/.]+$/, "")}-window.png`;

      URL.revokeObjectURL(imgUrl); //free our temp object >.<
    };

    img.src = imgUrl;

    const reader = new FileReader();
    reader.onload = function(event) { imgBase64 = event.target!.result; };
    reader.readAsDataURL(file);
  }

  function exportPNG() {
    const svgElement = document.querySelector<SVGSVGElement>("#preview svg");
    if (!svgElement) return;

    const code = new XMLSerializer().serializeToString(svgElement);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth / scale;
      canvas.height = targetHeight / scale;

      const context = canvas.getContext("2d");
      if (!context) return; 

      context.imageSmoothingEnabled = false; //KILL antialiasing
      context.drawImage(image, 0, 0, width, height);

      //then, force download >.<
      const element = document.createElement("a");
      element.setAttribute("href", canvas.toDataURL());
      element.setAttribute("download", bgFilename);
      element.style.display = "none";

      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      URL.revokeObjectURL(image.src); //cleanup~
    };
    image.src = URL.createObjectURL(new Blob([code], {type: "image/svg+xml;charset=utf-8"}));
  }

  //all the icons we have >_>
  const icons = ["w2k_1.webp","w2k_2.webp","w2k_3.webp","w2k_4.webp","w2k_5.webp","w2k_6.webp","w2k_7.webp","w2k_administrative_tools.webp","w2k_audio_cd.webp","w2k_bitmap_image.webp","w2k_cd_audio.webp","w2k_cd_player.webp","w2k_cd-rom_drive.webp","w2k_closed_folder.webp","w2k_computers.webp","w2k-computer.webp","w2k_computer.webp","w2k_configuration_settings.webp","w2k-control_panel.webp","w2k_control_panel.webp","w2k_default_application.webp","w2k-default_document.webp","w2k_default_document.webp","w2k_default_icon.webp","w2k_default_printer_floppy.webp","w2k_default_printer_network.webp","w2k_default_printer.webp","w2k_defragment.webp","w2k_desktop2.webp","w2k-desktop.webp","w2k_desktop.webp","w2k_dial-up_networking.webp","w2k_dial_up.webp","w2k-documents.webp","w2k_documents.webp","w2k_dustbin2.webp","w2k_dustbin_full.webp","w2k_dustbin.webp","w2k_eject.webp","w2k_entire_network.webp","w2k_favorites_folder.webp","w2k_favorites.webp","w2k_find.webp","w2k_floppy_2.webp","w2k_floppy_drive_3½.webp","w2k_floppy_drive_5.webp","w2k_floppy.webp","w2k_folder_closed.webp","w2k_folder_open.webp","w2k_font_2.webp","w2k_font_3.webp","w2k-fonts.webp","w2k_fonts.webp","w2k_font.webp","w2k_forbidden.webp","w2k_gif_image.webp","w2k_globe.webp","w2k_hard_drive.webp","w2k_harddrive.webp","w2k-help.webp","w2k_help.webp","w2k_hibernate.webp","w2k_hourglass_2.webp","w2k_hourglass.webp","w2k_info.webp","w2k_ini_&_inf.webp","w2k_internet_document.webp","w2k_internet_explorer.webp","w2k_jpeg_image.webp","w2k_key_2.webp","w2k_key.webp","w2k_lock.webp","w2k_log_off.webp","w2k_media_clip.webp","w2k_midi_sequence.webp","w2k_move.webp","w2k_movie_clip.webp","w2k_movie_maker.webp","w2k_mplayer32_1.webp","w2k_mplayer32_2.webp","w2k_mplayer32_3.webp","w2k_mplayer32_4.webp","w2k_mplayer32_5.webp","w2k_mplayer32_6.webp","w2k_mplayer32_7.webp","w2k_ms-dos_application.webp","w2k_ms-dos_batch_file.webp","w2k_multiple_files.webp","w2k-my_computer.webp","w2k_my_computer.webp","w2k_my_documents.webp","w2k_network_2.webp","w2k_network_3.webp","w2k_network_computer.webp","w2k-network_drive_connected.webp","w2k_network_drive_connected.webp","w2k_network_drive_disconnected.webp","w2k_network_drive_offline.webp","w2k_network_folders.webp","w2k_network_folder.webp","w2k_network_neighborhood.webp","w2k_network_printer.webp","w2k_network.webp","w2k_new_printer.webp","w2k_notepad_1.webp","w2k_notepad_2.webp","w2k_old_dustbin_2.webp","w2k_old_dustbin.webp","w2k_open_folder.webp","w2k_paint_2.webp","w2k_paint_3.webp","w2k_paint_4.webp","w2k_paint_5.webp","w2k_paint_6.webp","w2k_paint.webp","w2k_portable_drive.webp","w2k_printer_floppy.webp","w2k_printers_2.webp","w2k-printers.webp","w2k_printers.webp","w2k_printer_unknown.webp","w2k_printer.webp","w2k_program_group.webp","w2k_programs_2.webp","w2k-programs.webp","w2k_programs.webp","w2k_ram_drive.webp","w2k_ramdrive.webp","w2k_recycle_bin_empty.webp","w2k_recycle_bin_full.webp","w2k_removable_drive.webp","w2k_rich_text_format.webp","w2k_run.webp","w2k_scheduled_tasks.webp","w2k_search_2.webp","w2k_search2.webp","w2k_search_3.webp","w2k_search_4.webp","w2k_search_5.webp","w2k_search_6.webp","w2k_search_7.webp","w2k_search_8.webp","w2k_search.webp","w2k_server.webp","w2k_setting_printers.webp","w2k_settings_-_control_panel.webp","w2k_settings_-_printers.webp","w2k-settings.webp","w2k_settings.webp","w2k_sharing_overlay.webp","w2k_sharing.webp","w2k_shortcut_overlay.webp","w2k_shortcut.webp","w2k_shutdown_2.webp","w2k_shut_down.webp","w2k_shutdown.webp","w2k_sndrec_1.webp","w2k_sndrec_2.webp","w2k_sndrec_3.webp","w2k_sndvol_1.webp","w2k_sndvol_2.webp","w2k_sndvol_3.webp","w2k_sndvol_4.webp","w2k_sndvol_5.webp","w2k_start.webp","w2k_stop.webp","w2k_suspend.webp","w2k_system_2.webp","w2k_system_file.webp","w2k_system.webp","w2k_taskbar.webp","w2k_temporary.webp","w2k_text_document.webp","w2k_text_file.webp","w2k_the_internet.webp","w2k_tree.webp","w2k_uninstall_2.webp","w2k_uninstall_3.webp","w2k_uninstall.webp","w2k_unknown_10.webp","w2k_unknown_11.webp","w2k_unknown_12.webp","w2k_unknown_13.webp","w2k_unknown_14.webp","w2k_unknown_15.webp","w2k_unknown_16.webp","w2k_unknown_17.webp","w2k_unknown_18.webp","w2k_unknown_19.webp","w2k_unknown_20.webp","w2k_unknown_21.webp","w2k_unknown_22.webp","w2k_unknown_23.webp","w2k_unknown_24.webp","w2k_unknown_2.webp","w2k_unknown_3.webp","w2k_unknown_4.webp","w2k_unknown_5.webp","w2k_unknown_6.webp","w2k_unknown_7.webp","w2k_unknown_8.webp","w2k_unknown_9.webp","w2k_unknown_drive.webp","w2k_unknown_filetype.webp","w2k_unknown.webp","w2k_video_clip.webp","w2k_warning.webp","w2k_wave_sound.webp","w2k_windows_update.webp","w2k_wmp_10.webp","w2k_wmp_11.webp","w2k_wmp_12.webp","w2k_wmp_13.webp","w2k_wmp_14.webp","w2k_wmp_15.webp","w2k_wmp_16.webp","w2k_wmp_17.webp","w2k_wmp_18.webp","w2k_wmp_19.webp","w2k_wmp_1.webp","w2k_wmp_20.webp","w2k_wmp_21.webp","w2k_wmp_22.webp","w2k_wmp_23.webp","w2k_wmp_24.webp","w2k_wmp_25.webp","w2k_wmp_26.webp","w2k_wmp_27.webp","w2k_wmp_28.webp","w2k_wmp_29.webp","w2k_wmp_2.webp","w2k_wmp_30.webp","w2k_wmp_31.webp","w2k_wmp_32.webp","w2k_wmp_33.webp","w2k_wmp_34.webp","w2k_wmp_35.webp","w2k_wmp_36.webp","w2k_wmp_37.webp","w2k_wmp_38.webp","w2k_wmp_39.webp","w2k_wmp_3.webp","w2k_wmp_40.webp","w2k_wmp_41.webp","w2k_wmp_42.webp","w2k_wmp_43.webp","w2k_wmp_44.webp","w2k_wmp_45.webp","w2k_wmp_46.webp","w2k_wmp_47.webp","w2k_wmp_48.webp","w2k_wmp_49.webp","w2k_wmp_4.webp","w2k_wmp_50.webp","w2k_wmp_51.webp","w2k_wmp_52.webp","w2k_wmp_53.webp","w2k_wmp_54.webp","w2k_wmp_55.webp","w2k_wmp_56.webp","w2k_wmp_57.webp","w2k_wmp_58.webp","w2k_wmp_59.webp","w2k_wmp_5.webp","w2k_wmp_60.webp","w2k_wmp_6.webp","w2k_wmp_7.webp","w2k_wmp_8.webp","w2k_wmp_9.webp","w2k_workgroup.webp","w2k_write_document.webp","w2k_write.webp","w2k_wupdate_1.webp","w2k_wupdate_2.webp","w2k_zip_file.webp","w95_10.webp","w95_11.webp","w95_12.webp","w95_13.webp","w95_14.webp","w95_15.webp","w95_16.webp","w95_17.webp","w95_18.webp","w95_19.webp","w95_1.webp","w95_20.webp","w95_21.webp","w95_22.webp","w95_23.webp","w95_24.webp","w95_25.webp","w95_26.webp","w95_27.webp","w95_28.webp","w95_29.webp","w95_2.webp","w95_30.webp","w95_31.webp","w95_32.webp","w95_33.webp","w95_34.webp","w95_35.webp","w95_36.webp","w95_37.webp","w95_38.webp","w95_39.webp","w95_3.webp","w95_40.webp","w95_41.webp","w95_42.webp","w95_43.webp","w95_44.webp","w95_45.webp","w95_46.webp","w95_47.webp","w95_48.webp","w95_49.webp","w95_4.webp","w95_50.webp","w95_51.webp","w95_52.webp","w95_53.webp","w95_54.webp","w95_55.webp","w95_56.webp","w95_57.webp","w95_58.webp","w95_59.webp","w95_5.webp","w95_60.webp","w95_61.webp","w95_62.webp","w95_63.webp","w95_64.webp","w95_65.webp","w95_66.webp","w95_67.webp","w95_68.webp","w95_69.webp","w95_6.webp","w95_70.webp","w95_71.webp","w95_72.webp","w95_7.webp","w95_8.webp","w95_9.webp","w98_accesibility_window_abc.webp","w98_accessibility_big_keys.webp","w98_accessibility_contrast.webp","w98_accessibility_kbd_mouse.webp","w98_accessibility_key_pointer.webp","w98_accessibility_stopwatch.webp","w98_accessibility_toggle2.webp","w98_accessibility_toggle3.webp","w98_accessibility_toggle.webp","w98_accessibility_two_windows.webp","w98_accessibility.webp","w98_accessibility_window_objs.webp","w98_accessibility_window_signal.webp","w98_accessibility_window_speak.webp","w98_access_wheelchair_big.webp","w98_ac_plug.webp","w98_active_movie.webp","w98_address_book_card_copy.webp","w98_address_book_cards.webp","w98_address_book_card_users.webp","w98_address_book_card.webp","w98_address_book_copy.webp","w98_address_book_home.webp","w98_address_book_pad_users.webp","w98_address_book_pad.webp","w98_address_book_users.webp","w98_address_book_user.webp","w98_address_book.webp","w98_amplify.webp","w98_application_hammer_grouppol.webp","w98_application_hourglass_small_cool.webp","w98_application_hourglass_small.webp","w98_application_hourglass.webp","w98_appwizard_list.webp","w98_appwizard.webp","w98_appwiz_file.webp","w98_audio_compression.webp","w98_backup_devices_2.webp","w98_backup_devices.webp","w98_bar_graph_default.webp","w98_bar_graph.webp","w98_battery_alt.webp","w98_battery.webp","w98_briefcase.webp","w98_cable_2.webp","w98_cable_3.webp","w98_cable.webp","w98_calculator.webp","w98_calendar2.webp","w98_calendar.webp","w98_camera_2.webp","w98_camera3_network.webp","w98_camera3_plus.webp","w98_camera3_vid.webp","w98_camera3.webp","w98_camera_vid_ms.webp","w98_camera_vid.webp","w98_camera.webp","w98_cardfile.webp","w98_card_reader_empty.webp","w98_card_reader_not.webp","w98_card_reader_question.webp","w98_card_reader_restr.webp","w98_card_reader.webp","w98_cassette_tape.webp","w98_catalog_excl.webp","w98_catalog_no.webp","w98_catalog.webp","w98_c-clamp.webp","w98_cd_audio_cd_a.webp","w98_cd_audio_cd.webp","w98_cd_drive_purple.webp","w98_cd_drive.webp","w98_certificate_2_excl.webp","w98_certificate_2_no.webp","w98_certificate_2.webp","w98_certificate_3.webp","w98_certificate_application.webp","w98_certificate_checklist.webp","w98_certificate_envelope_key.webp","w98_certificate_excl.webp","w98_certificate_gear.webp","w98_certificate_multiple.webp","w98_certificate_no.webp","w98_certificate_red_line.webp","w98_certificate_seal_lock.webp","w98_certificate_seal.webp","w98_certificate_server.webp","w98_certificate.webp","w98_channels_file.webp","w98_channels.webp","w98_charmap_w2k.webp","w98_charmap.webp","w98_chart1.webp","w98_check.webp","w98_chip_ramdrive.webp","w98_chm.webp","w98_circle_question.webp","w98_clean_drive.webp","w98_clock.webp","w98_color_profile_gray.webp","w98_color_profile.webp","w98_computer_2_cool.webp","w98_computer_2.webp","w98_computer_explorer_2k.webp","w98_computer_explorer_cool.webp","w98_computer_explorer.webp","w98_computer_gear.webp","w98_computer_musical_keyboard.webp","w98_computer_padlock.webp","w98_computer_search.webp","w98_computer_sound.webp","w98_computer_taskmgr.webp","w98_computer_user_pencil.webp","w98_computer.webp","w98_computer_win_lock.webp","w98_computer_win.webp","w98_conn_cloud_ok.webp","w98_conn_cloud.webp","w98_conn_dialup_alt.webp","w98_conn_dialup_ok.webp","w98_conn_dialup_recbin_phones.webp","w98_conn_dialup_recbin_phone.webp","w98_conn_dialup.webp","w98_connected_world.webp","w98_conn_network_no_phone.webp","w98_conn_pcs_no_network.webp","w98_conn_pcs_off_off.webp","w98_conn_pcs_off_on.webp","w98_conn_pcs_on_off.webp","w98_conn_pcs_on_on.webp","w98_console_prompt.webp","w98_cylinder_database.webp","w98_defragment.webp","w98_desktop_old.webp","w98_desktop_w95.webp","w98_desktop.webp","w98_device_rhombic_chip.webp","w98_direct_cable_conn.webp","w98_directory_admin_tools.webp","w98_directory_business_calendar.webp","w98_directory_channels.webp","w98_directory_check.webp","w98_directory_closed_cool.webp","w98_directory_closed_history.webp","w98_directory_closed.webp","w98_directory_computer.webp","w98_directory_control_panel_cool.webp","w98_directory_control_panel.webp","w98_directory_dial-up_networking_cool.webp","w98_directory_dial-up_networking.webp","w98_directory_e_open.webp","w98_directory_e.webp","w98_directory_explorer.webp","w98_directory_favorites_small.webp","w98_directory_favorites.webp","w98_directory_folder_options.webp","w98_directory_fonts_cool.webp","w98_directory_fonts_shortcut.webp","w98_directory_fonts.webp","w98_directory_movie.webp","w98_directory_net_web.webp","w98_directory_network_conn_shortcut.webp","w98_directory_network_conn.webp","w98_directory_open_cabinet_fc.webp","w98_directory_open_cabinet.webp","w98_directory_open_cool.webp","w98_directory_open_file_mydocs_2k.webp","w98_directory_open_file_mydocs_cool.webp","w98_directory_open_file_mydocs_small.webp","w98_directory_open_file_mydocs.webp","w98_directory_open_history.webp","w98_directory_open_net_web_documents.webp","w98_directory_open_network.webp","w98_directory_open_refresh.webp","w98_directory_open.webp","w98_directory_pictures.webp","w98_directory_printer_cool.webp","w98_directory_printer_shortcut.webp","w98_directory_printer.webp","w98_directory_program_group_cool.webp","w98_directory_program_group_small_c.webp","w98_directory_program_group_small.webp","w98_directory_program_group.webp","w98_directory_scanner_camera.webp","w98_directory_sched_tasks.webp","w98_directory_seven.webp","w98_directory_shared.webp","w98_directory_web.webp","w98_directory_zipper_alt.webp","w98_directory_zipper.webp","w98_directx_alt.webp","w98_directx.webp","w98_diskettes_copy.webp","w98_display_properties.webp","w98_doctor_watson.webp","w98_document.webp","w98_download.webp","w98_drum_onestick.webp","w98_eject_pc_2.webp","w98_eject_pc_cool.webp","w98_eject_pc_shell32.webp","w98_eject_pc.webp","w98_entire_network_globe.webp","w98_envelope_closed.webp","w98_envelope_open_sheet.webp","w98_erase_file.webp","w98_event_log.webp","w98_executable_gear.webp","w98_executable_script.webp","w98_executable_sound.webp","w98_executable.webp","w98_expand_hierarchial_array.webp","w98_expansion_board_modem.webp","w98_expansion_board.webp","w98_fax_machine_exclam.webp","w98_fax_machine_paperstack.webp","w98_fax_machine.webp","w98_file_blue_grad_paint.webp","w98_file_cd.webp","w98_file_eye.webp","w98_file_gears.webp","w98_file_lines.webp","w98_filepack.webp","w98_file_padlock.webp","w98_file_program_group.webp","w98_file_question.webp","w98_file_set.webp","w98_file_sorted_lock.webp","w98_file_windows.webp","w98_file_win_shortcut.webp","w98_floppy_drive_3-5_cool.webp","w98_floppy_drive_3-5.webp","w98_floppy_drive_5-25_cool.webp","w98_floppy_drive_5-25.webp","w98_font_adobe.webp","w98_font_bitmap.webp","w98_font_opentype.webp","w98_font_tt_green.webp","w98_font_tt.webp","w98_frame_web.webp","w98_game_freecell.webp","w98_game_hearts.webp","w98_game_mine_1.webp","w98_game_mine_2.webp","w98_game_solitaire.webp","w98_game_spider.webp","w98_gears_3.webp","w98_gears_tweakui_a.webp","w98_gears_tweakui_b.webp","w98_gears.webp","w98_globe_map.webp","w98_gps.webp","w98_graphedit_file_2.webp","w98_graphedit_file.webp","w98_graphedit.webp","w98_hard_disk_drive_cool.webp","w98_hard_disk_drive_pie.webp","w98_hard_disk_drives.webp","w98_hard_disk_drive_tools.webp","w98_hard_disk_drive.webp","w98_hardware.webp","w98_help_book_big.webp","w98_help_book_computer.webp","w98_help_book_cool_small.webp","w98_help_book_cool.webp","w98_help_book_small.webp","w98_help_question_mark.webp","w98_help_sheet.webp","w98_history.webp","w98_homepage_alt.webp","w98_homepage.webp","w98_html2_new.webp","w98_html2.webp","w98_html.webp","w98_image_old_gif.webp","w98_image_old_jpeg.webp","w98_imagGIF.webp","w98_imagJPEG.webp","w98_imagKoda.webp","w98_imagOthe.webp","w98_imagPNG.webp","w98_imagWMF.webp","w98_infrared.webp","w98_input_devices.webp","w98_installer_file_gear.webp","w98_installer_generic_old.webp","w98_installer.webp","w98_internet_connection_wiz.webp","w98_internet_options_old_e.webp","w98_internet_options.webp","w98_ipconfig.webp","w98_java_dpf.webp","w98_java_ocx.webp","w98_java.webp","w98_joystick_alt.webp","w98_joystick_button.webp","w98_joystick.webp","w98_keyboard_delay.webp","w98_keyboard_musical_midi.webp","w98_keyboard_musical.webp","w98_keyboard_repeat_rate.webp","w98_keyboard.webp","w98_key_gray.webp","w98_key_padlock_help.webp","w98_key_padlock.webp","w98_keys.webp","w98_key_webfile.webp","w98_key_win_alt.webp","w98_key_win.webp","w98_key_world.webp","w98_kodak_imaging_file.webp","w98_kodak_imaging.webp","w98_laptop_infrared_2.webp","w98_laptop_infrared.webp","w98_laptop_small.webp","w98_laptop.webp","w98_loudspeaker_muted.webp","w98_loudspeaker_rays_green.webp","w98_loudspeaker_rays.webp","w98_loudspeaker_wave.webp","w98_magnifying_glass_3.webp","w98_magnifying_glass_4.webp","w98_magnifying_glass.webp","w98_mailbox_world.webp","w98_mci_devices.webp","w98_media_player_file.webp","w98_media_player_stream_conn1.webp","w98_media_player_stream_conn2.webp","w98_media_player_stream_mono.webp","w98_media_player_stream_no2.webp","w98_media_player_stream_no.webp","w98_media_player_stream_stereo.webp","w98_media_player_stream_sun0.webp","w98_media_player_stream_sun1.webp","w98_media_player_stream_sun2.webp","w98_media_player_stream_sun3.webp","w98_media_player_stream_sun4.webp","w98_media_player.webp","w98_memory.webp","w98_message_empty_tack.webp","w98_message_envelope_open.webp","w98_message_file.webp","w98_message_tack.webp","w98_microphone_2.webp","w98_microphone.webp","w98_midi_bl.webp","w98_midi_gr.webp","w98_midi_mg.webp","w98_midi_tl.webp","w98_minesweeper.webp","w98_mixer_cd_sound.webp","w98_mixer_keyboard_musical.webp","w98_mixer_sound.webp","w98_modem.webp","w98_monitor_application.webp","w98_monitor_black.webp","w98_monitor_blue_grad.webp","w98_monitor_gear.webp","w98_monitor_moon.webp","w98_monitor_tweakui.webp","w98_monitor_windows.webp","w98_mouse_hide.webp","w98_mouse_location.webp","w98_mouse_ms.webp","w98_mouse_padlock.webp","w98_mouse_snap.webp","w98_mouse_speed.webp","w98_mouse_trails.webp","w98_mouse.webp","w98_mouse_wireless.webp","w98_move_system_file.webp","w98_movie_maker.webp","w98_msagent_file.webp","w98_msagent.webp","w98_msconfig.webp","w98_ms-dos_2.webp","w98_ms-dos.webp","w98_msg_error.webp","w98_msg_information.webp","w98_msg_question.webp","w98_msg_warning_inv.webp","w98_msg_warning.webp","w98_mshearts.webp","w98_msie1.webp","w98_msie2.webp","w98_msie_box.webp","w98_msinfo32.webp","w98_msn2.webp","w98_msn3.webp","w98_msn_cool.webp","w98_msn.webp","w98_multimedia.webp","w98_nail.webp","w98_netmeeting_share.webp","w98_netmeeting.webp","w98_netshow_arrow.webp","w98_netshow_notransm.webp","w98_netshow.webp","w98_network_cool_two_pcs.webp","w98_network_drive_cool.webp","w98_network_drive_unavailable_cool.webp","w98_network_drive_unavailable.webp","w98_network_drive.webp","w98_network_drive_world.webp","w98_network_internet_pcs_installer.webp","w98_network_normal_two_pcs.webp","w98_network_television.webp","w98_network_televisons.webp","w98_network_three_pcs.webp","w98_network.webp","w98_newspaper_mail.webp","w98_newspaper.webp","w98_no2.webp","w98_notepad_file_gear.webp","w98_notepad_file.webp","w98_notepad.webp","w98_note.webp","w98_no.webp","w98_odbc.webp","w98_ole2.webp","w98_ole.webp","w98_outlook_express_tack_drive.webp","w98_outlook_express_tack_folder.webp","w98_outlook_express_tack.webp","w98_outlook_express.webp","w98_overlay_black.webp","w98_overlay_refresh.webp","w98_overlay_share_cool.webp","w98_overlay_share.webp","w98_overlay_shortcut.webp","w98_package.webp","w98_paintbrush.webp","w98_paint_file.webp","w98_paint_old.webp","w98_paint.webp","w98_paint_window.webp","w98_palm_computer.webp","w98_paper_roll.webp","w98_pci_card_alt.webp","w98_pci_card.webp","w98_pcx_alt.webp","w98_pcx.webp","w98_phone_desk.webp","w98_pictures.webp","w98_pie_chart_drvspace.webp","w98_pifedit.webp","w98_power_management.webp","w98_printer_big.webp","w98_printer_cool.webp","w98_printer_def_diskette.webp","w98_printer_def_network.webp","w98_printer_def.webp","w98_printer_desk.webp","w98_printer_diskette.webp","w98_printer_feeding_slot.webp","w98_printer_network.webp","w98_printer_pause.webp","w98_printer_play.webp","w98_printer_plotter.webp","w98_printer_question.webp","w98_printer_shared.webp","w98_printer_slim.webp","w98_printer_slot_filled.webp","w98_printer.webp","w98_print_server.webp","w98_processor.webp","w98_program_manager.webp","w98_ram_drive.webp","w98_recycle_bin_directory.webp","w98_recycle_bin_empty_2k.webp","w98_recycle_bin_empty_cool.webp","w98_recycle_bin_empty.webp","w98_recycle_bin_file_directory.webp","w98_recycle_bin_file.webp","w98_recycle_bin_full_2k.webp","w98_recycle_bin_full_cool.webp","w98_recycle_bin_full.webp","w98_regedit_binary_lock.webp","w98_regedit_binary.webp","w98_regedit_file.webp","w98_regedit_string.webp","w98_regedit.webp","w98_registration_no.webp","w98_registration.webp","w98_removable_disk_drive_alt.webp","w98_removable_disk_drive.webp","w98_rename.webp","w98_replace_directory.webp","w98_replace_file.webp","w98_restrict.webp","w98_rj_jack.webp","w98_Roland_GS.webp","w98_scandisk.webp","w98_scanner_alt_network.webp","w98_scanner_alt.webp","w98_scanner_camera.webp","w98_scanner_video_cam.webp","w98_scanner.webp","w98_scanregw.webp","w98_sched_tasks.webp","w98_screen_keyboard.webp","w98_script_file_blue.webp","w98_script_file_teal.webp","w98_script_file_yellow.webp","w98_scsi.webp","w98_search_computer.webp","w98_search_directory.webp","w98_search_file_2_cool.webp","w98_search_file_2.webp","w98_search_file_3.webp","w98_search_file.webp","w98_search_laptop_1.webp","w98_search_laptop_2.webp","w98_search_laptop_3.webp","w98_search_laptop_4.webp","w98_search_server.webp","w98_search_web.webp","w98_server_gear.webp","w98_server_to_desktop.webp","w98_server_window.webp","w98_settings_gear_cool.webp","w98_settings_gear.webp","w98_shell_window1.webp","w98_shell_window2.webp","w98_shell_window3.webp","w98_shell_window4.webp","w98_shell_window5.webp","w98_shell_window6.webp","w98_shut_down_cool.webp","w98_shut_down_normal.webp","w98_shut_down_with_computer.webp","w98_signature_excl.webp","w98_signature_no.webp","w98_signature.webp","w98_sndvol32_input.webp","w98_sndvol32_main.webp","w98_sndvol32_output.webp","w98_SoundGrn.webp","w98_SoundPu2.webp","w98_SoundPur.webp","w98_SoundTel.webp","w98_SoundVor.webp","w98_SoundYel.webp","w98_spider.webp","w98_standby_monitor_moon_cool.webp","w98_standby_monitor_moon.webp","w98_start_menu_shortcuts.webp","w98_start_menu_xp.webp","w98_system_restore.webp","w98_telephony.webp","w98_template_directory_net_web.webp","w98_template_empty.webp","w98_template_nework_conn.webp","w98_template_nework_places.webp","w98_template_printer.webp","w98_template_scanner_camera.webp","w98_template_sched_task.webp","w98_template_world.webp","w98_themes.webp","w98_time_and_date.webp","w98_tip.webp","w98_tools_gear.webp","w98_tree.webp","w98_true_type_paint.webp","w98_trust0.webp","w98_trust1_restrict.webp","w98_tune-up.webp","w98_unplug_eject_pc.webp","w98_unplug_storage.webp","w98_ups.webp","w98_url1a.webp","w98_url1.webp","w98_url2.webp","w98_usb_port.webp","w98_usb.webp","w98_user_calendar.webp","w98_user_card_view.webp","w98_user_card.webp","w98_user_computer_pair.webp","w98_user_computer.webp","w98_user_network.webp","w98_users_green.webp","w98_users_key.webp","w98_users.webp","w98_user_world.webp","w98_utopia_smiley.webp","w98_video_compression.webp","w98_video_gr.webp","w98_video_mg.webp","w98_video_mk.webp","w98_video_tl.webp","w98_video_.webp","w98_web_file_set.webp","w98_web_file.webp","w98_wia_img_a.webp","w98_wia_img_check.webp","w98_wia_img_color_sound.webp","w98_wia_img_color.webp","w98_wia_img_gray.webp","w98_window_red_hilights.webp","w98_windows_button.webp","w98_windows_movie.webp","w98_windows_slanted.webp","w98_windows_three.webp","w98_windows_title.webp","w98_windows_update_large.webp","w98_windows_update_old.webp","w98_windows_update_small.webp","w98_windows.webp","w98_winrep_mag_glass.webp","w98_WinRep.webp","w98_wm_file.webp","w98_wm.webp","w98_world_address_book.webp","w98_world_lock.webp","w98_world_network_directories.webp","w98_world_phonereceiver.webp","w98_world_star.webp","w98_world.webp","w98_write_card_phone.webp","w98_write_file.webp","w98_write_red.webp","w98_write_wordpad.webp","w98_write_yellow.webp","w98_xml_gear.webp","w98_xml.webp"];
</script>

<h1 style="text-align: center">yuiyamu window generator :3</h1>
<p style="text-align: center">much less versatile compared to <a href="http://tpenguinltg.wordpress.com/">tPenguinLTG</a>'s <a href="https://github.com/tpenguinltg/winclassic-window">winclassic-window</a>, but made more efficient for video making >:3</p>

<div class="divider" style="margin-bottom: 20px;"></div>

<div id="options">
  <div class="box">
    <label for="upload">upload file</label>
    <input id="upload" type="file" accept="image/*" bind:files={inputFiles} onchange={() => uploadFile()} />
  </div>
  <div class="box">
    <label for="title-bar">title</label>
    <input id="title-bar" type="text" bind:value={windowTitle}/>
  </div>
  <div class="box">
    <label for="scale">scale</label>
    <input id="scale" type="range" min="1" max="25" bind:value={scale}/>
  </div>
  <div class="box">
    <span>icon</span>
    <div>
    </div>
  </div>
</div>
<p style="margin-bottom: 0; font-size: 14px;">(note: remember to reupload image if changing scale)</p>

<div id="prev-container">
<div id="preview">
<svg width="{targetWidth}" height="{targetHeight}" viewBox="0 0 {targetWidth} {targetHeight}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
   <!-- fuckass shit below is trying its best to kill antialiasing >.< -->
   <style><![CDATA[
     @font-face{ font-family: 'Tahoma'; src: url('/ms_sans_serif_bold.woff2') }
     svg { shape-rendering: crispEdges; }
     text { text-rendering: optimizeSpeed; }

     .ButtonDkShadow { fill: #000000; }
     .ButtonShadow   { fill: #5A4EB1; }
     .ButtonFace     { fill: #AEA8D9; }
     .ButtonLight    { fill: #AEA8D9; }
     .ButtonHilight  { fill: #D8D5EC; }
     .ButtonText     { fill: #000000; }
     .ActiveTitle    { fill: #5A4EB1; stop-color: #5A4EB1; }
     .GradientActiveTitle { fill: #B68FCB; stop-color: #B68FCB; }
     .InactiveTitle    { fill: #808080; stop-color: #808080; }
     .GradientInactiveTitle { fill: #B8B4D0; stop-color: #B8B4D0; }
     .Window { fill: #AEA8D9; }
   ]]></style>
   <defs>
     <rect id="minimize-symbol" width="6" height="2" class="ButtonText"/>
     <path id="maximize-symbol" fill-rule="evenodd" d="m 0,0 h 9 v 9 h -9 v -9 m 1,2 v 6 h 7 v -6 h -7" class="ButtonText"/>
     <path id="restore-symbol" fill-rule="evenodd" d="m 0,9 v -6 h 2 v -3 h 6 v 6 h -2 v 3 h -6 m 1,-1 h 4 v -3 h -4 v 3 m 6,-6 h -4 v 1 h 3 v 2 h 1 v -3" class="ButtonText"/>
     <path id="close-symbol" d="m 0,0 h 2 v 1 h 1 v 1 h 2 v -1 h 1 v -1 h 2 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h 1 v 1 h 1 v 1 h 1 v 1 h -2 v -1 h -1 v -1 h -2 v 1 h -1 v 1 h -2 v -1 h 1 v -1 h 1 v -1 h 1 v -1 h -1 v -1 h -1 v -1 h -1 v -1" class="ButtonText"/>
     <path id="scroll-up-symbol" d="m 0,4 v -1 h 1 v -1 h 1 v -1 h 1 v -1 h 1 v 1 h 1 v 1 h 1 v 1 h 1 v 1 h -7" class="ButtonText"/>
     <path id="scroll-down-symbol" d="m 0,0 h 7 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v -1 h -1 v -1 h -1 v -1 h -1 v -1" class="ButtonText"/>
     <linearGradient id="titlebar-gradient">
       <stop offset="0" class="{titleColor}"/>
       <stop offset="1" class="{titleGradientColor}"/>
     </linearGradient>
     <pattern id="scrollbar-pattern" width="2" height="2" patternUnits="userSpaceOnUse">
       <rect x="0" y="0" width="2" height="2" class="ButtonFace"/>
       <rect x="0" y="0" width="1" height="1" class="ButtonHilight"/>
       <rect x="1" y="1" width="1" height="1" class="ButtonHilight"/>
     </pattern>
     <g id="titlebar-button">
       <rect x="0" y="0" width="16" height="14" class="ButtonDkShadow"/>
       <rect x="0" y="0" width="15" height="13" class="ButtonHilight"/>
       <rect x="1" y="1" width="14" height="12" class="ButtonShadow"/>
       <rect x="1" y="1" width="13" height="11" class="ButtonLight"/>
       <rect x="2" y="2" width="12" height="10" class="ButtonFace"/>
     </g>
     <g id="scrollbar-button">
       <rect x="0" y="0" width="16" height="16" class="ButtonDkShadow"/>
       <rect x="0" y="0" width="15" height="15" class="ButtonLight"/>
       <rect x="1" y="1" width="14" height="14" class="ButtonShadow"/>
       <rect x="1" y="1" width="13" height="13" class="ButtonHilight"/>
       <rect x="2" y="2" width="12" height="12" class="ButtonFace"/>
     </g>
     <g id="resize-grip">
       <path class="ButtonHilight" d="m 0,12 h 12 v -12 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1"/>
       <path class="ButtonShadow" d="m 1,12 h 11 v -11 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1"/>
       <path class="ButtonFace" d="m 3,12 h 9 v -9 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1"/>
       <path class="ButtonHilight" d="m 4,12 h 8 v -8 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1"/>
       <path class="ButtonShadow" d="m 5,12 h 7 v -7 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1"/>
       <path class="ButtonFace" d="m 7,12 h 5 v -5 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1"/>
       <path class="ButtonHilight" d="m 8,12 h 4 v -4 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1"/>
       <path class="ButtonShadow" d="m 9,12 h 3 v -3 h -1 v 1 h -1 v 1 h -1 v 1"/>
       <path class="ButtonFace" d="m 0,13 h 13 v -13 h -1 v 11 h -1 v 1 h -11 v 1"/>
     </g>

     <g id="minimize-button">
       <use href="#titlebar-button" xlink:href="#titlebar-button"/>
       <use href="#minimize-symbol" xlink:href="#minimize-symbol" x="4" y="9"/>
     </g>
     <g id="maximize-button">
       <use href="#titlebar-button" xlink:href="#titlebar-button"/>
       <use href="#maximize-symbol" xlink:href="#maximize-symbol" x="3" y="2"/>
     </g>
     <g id="restore-button">
       <use href="#titlebar-button" xlink:href="#titlebar-button"/>
       <use href="#restore-symbol" xlink:href="#restore-symbol" x="3" y="2"/>
     </g>
     <g id="close-button">
       <use href="#titlebar-button" xlink:href="#titlebar-button"/>
       <use href="#close-symbol" xlink:href="#close-symbol" x="4" y="3"/>
     </g>
     <g id="scroll-up-button">
       <use href="#scrollbar-button" xlink:href="#scrollbar-button"/>
       <use href="#scroll-up-symbol" xlink:href="#scroll-up-symbol" x="4" y="6"/>
     </g>
     <g id="scroll-down-button">
       <use href="#scrollbar-button" xlink:href="#scrollbar-button"/>
       <use href="#scroll-down-symbol" xlink:href="#scroll-down-symbol" x="4" y="6"/>
     </g>

     <g id="titlebar-control-box">
       <rect class="{titleGradientColor}" width="{titlebar.controlBox.width}" height="{titlebar.controlBox.height}"/>
       <use href="#minimize-button" xlink:href="#minimize-button" x="{padding}" y="2"/>
       <use href="#maximize-button" xlink:href="#maximize-button" x="{padding + titlebar.button.width}" y="2"/>
       <use href="#close-button" xlink:href="#close-button" x="{2 * padding + 2 * titlebar.button.width}" y="2"/>
     </g>

     <g id="window-frame">
       <rect x="0" y="0" width="{windowFrame.width - 0}" height="{windowFrame.height - 0}" class="ButtonDkShadow"/>
       <rect x="0" y="0" width="{windowFrame.width - 1}" height="{windowFrame.height - 1}" class="ButtonLight"/>
       <rect x="1" y="1" width="{windowFrame.width - 2}" height="{windowFrame.height - 2}" class="ButtonShadow"/>
       <rect x="1" y="1" width="{windowFrame.width - 3}" height="{windowFrame.height - 3}" class="ButtonHilight"/>
       <rect x="2" y="2" width="{windowFrame.width - 4}" height="{windowFrame.height - 4}" class="ButtonFace"/>
     </g>
     <g id="window-text-area">
       <rect x="0" y="0" width="{windowTextArea.width - 0}" height="{windowTextArea.height - 0}" class="ButtonHilight"/>
       <rect x="0" y="0" width="{windowTextArea.width - 1}" height="{windowTextArea.height - 1}" class="ButtonShadow"/>
       <rect x="1" y="1" width="{windowTextArea.width - 2}" height="{windowTextArea.height - 2}" class="ButtonLight"/>
       <rect x="1" y="1" width="{windowTextArea.width - 3}" height="{windowTextArea.height - 3}" class="ButtonDkShadow"/>
       <rect x="2" y="2" width="{windowTextArea.width - 4}" height="{windowTextArea.height - 4}" class="Window"/>
     </g>
     <g id="scrollbar">
       <rect fill="url(#scrollbar-pattern)" width="16" height="{scrollbar.height}"/>
       <use href="#scroll-up-button" xlink:href="#scroll-up-button"/>
       <use href="#scroll-down-button" xlink:href="#scroll-down-button" x="0" y="{scrollbar.height - scrollbar.button.height}"/>
     </g>
     <g id="statusbar">
       <rect x="0" y="0" width="{statusbar.width - 0}" height="{statusbar.height - 0}" class="ButtonHilight"/>
       <rect x="0" y="0" width="{statusbar.width - 1}" height="{statusbar.height - 1}" class="ButtonShadow"/>
       <rect x="1" y="1" width="{statusbar.width - 2}" height="{statusbar.height - 2}" class="ButtonFace"/>
     </g>

     <g id="titlebar">
       <rect fill="url(#titlebar-gradient)" width="{titlebar.gradient.width}" height="18"/>
       <image href="{windowIcon}" x="3" y="{(titlebarHeight - 14) / 2}" width="14" height="14" style="image-rendering: pixelated;"/>
       <text x="{3 + 14 + 3}" y="{titlebarHeight / 2}" dominant-baseline="central" class="ButtonHilight" style="font-family: 'Tahoma', serif; font-size: 11px; font-weight: bold;">{windowTitle}</text>
       <use href="#titlebar-control-box" xlink:href="#titlebar-control-box" x="{titlebar.gradient.width}"/>
     </g>

     <g id="window-main">
       <use href="#window-text-area" xlink:href="#window-text-area"/>
       <image href={imgBase64} x="2" y="2" width="{windowTextArea.width - 4}" height="{windowTextArea.height - 4}"/>
       {#if showScrollbar}
       <use href="#scrollbar" xlink:href="#scrollbar" x="{scrollbar.x}" y="{scrollbar.y}"/>
       {/if}
    </g>

     <g id="window-contents">
       <rect width="{windowContents.width}" height="{windowContents.height}" class="ButtonFace"/>
       <use href="#titlebar" xlink:href="#titlebar" y="0"/>
       <use href="#window-main" xlink:href="#window-main" y="{titlebar.height + padding}"/>
       {#if showStatus}
       <use href="#statusbar" xlink:href="#statusbar" y="{windowContents.height - statusbar.height}"/>
       {/if}
       {#if showResize}
       <use href="#resize-grip" xlink:href="#resize-grip" x="{resizeGrip.x}" y="{resizeGrip.y}"/>
       {/if}
     </g>
   </defs>
   <g id="window" transform="scale({scale})">
    <use href="#window-frame" xlink:href="#window-frame" x="0" y="0"/>
    <use href="#window-contents" xlink:href="#window-contents" x="{windowContents.x}" y="{windowContents.y}"/>
   </g>
</svg>
</div>
</div>

<button class="invis-button" onclick={() => exportPNG()}>
  <img src="/download-chinese.gif" />
</button>

<img src="/girl.gif" style="position: absolute; bottom: 0; right: 0;" />
<img src="/meirl.gif" style="position: absolute; bottom: 0; left: 0;" />

<div class="divider"></div>
<p>made by <a href="https://yuru.ca">yuiyamu</a>, based on <a href="http://tpenguinltg.wordpress.com/">tPenguinLTG</a>'s <a href="https://github.com/tpenguinltg/winclassic-window">winclassic-window</a> project~</p>

<style>
  :global(body) {
    text-align: center;
    background-image: url("/background.jpg");
    color: #503131;
  }

  button {
    font-family: serif;
  } input {
    font-family: serif;
  } input[type="file"]::file-selector-button {
    font-family: serif;
  }

  .divider {
    margin-left: 16%;
    margin-right: 16%;
    height: 3px;
    background-color: #644c3e;
  }

  .box {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    
    color: #1d1515;
    background-color: #a78a7a6e;
  }

  #prev-container {
    display: flex;
    justify-content: center;
  }
  #preview {
    margin-top: 20px;
    margin-bottom: 20px;
    display: inline-block;
    overflow: hidden;
    padding: 20px;
    border: 2px inset black;
    background-color: #808080;
  }

  .invis-button {
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    text-align: inherit;
    cursor: pointer;
    appearance: none;
  }
</style>