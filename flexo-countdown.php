<?php
/*
Plugin Name: Flexo Counter
Version: 1.0001
Plugin URI: http://www.flexostudio.com/wordpress-plugins-flexo-utils.html
Description: Ad
Author: Grigor Grigorov, Mariela Stefanova, Flexo Studio Team
Revision Author: Chuck Norris
*/


class flexoCountdown {
	
	/* =public functions
	-------------------------------------------------------------------------------------- */		
	public static function init(){
		$url = plugins_url( '' , __FILE__ );
		wp_enqueue_script('fcounter-jq', $url.'/jquery-ui.min.js', array('jquery'));
		wp_enqueue_script('fcounter', $url.'/fcounter.js', array('jquery'));
		wp_enqueue_style('fcountercss', $url.'/fcounter.css');
		//wp_enqueue_style('nivoCustomStyleSheet', $url.'/custom-nivo-slider.css');
	}

	public static function wp_footer(){
		?>
		<!-- Flexo Counter Footer by Flexo Studio -->
		<?php
	}	
	
	public static function the_content($content){
		global $flexoslider_html_gallery;
		$ret 			=	"";
		$pattern	=	"[flexoCountdown ";
		
		$spos 		=	0;
		$epos			=	-1;
		//echo $content;
		while(($spos = strpos($content,$pattern,++$epos)) > -1):
			$last			=	$epos;
			$epos			=	strpos($content,"]",$spos);
			if($epos != -1):
				//$ret	 .= 
				$offset		=	strpos($content," ",$spos);
				$settings	=	substr($content,$offset,$epos - $offset);
	
				$ret   .= substr($content,$last,$spos-$last);
				if(preg_match_all('/(?<key>[^=]+)=[\'"](?<val>[^\'"]+)[\'"]/i',$settings,$m)){
					$params		=	array();	
					//echo $ret;
					
				
					foreach($m['key'] as $key => $val):
						$_key	=	trim($m['key'][$key]);
						$params[$_key] = trim($m['val'][$key]);
					endforeach;
				}
				$ret .= self::init_clock($params);
				//print_r($params);
			endif;
		endwhile;
			$ret .= substr($content,$epos);//echo $ret;
		return $ret;
	}
	/* =WP Section
	-------------------------------------------------------------------------------------- */		
	public static function get_date($str_date){
		$ret	=	0;
		
		$p	=	"/(?P<day>\d+)\.(?P<month>\d+)\.(?P<year>\d+)\s+(?P<hour>\d+):(?P<minutes>\d+)/im";
		
		if(preg_match($p,trim($str_date),$m)){
			$ret	=	mktime($m['hour'],$m['minutes'],0,$m['month'],$m['day'],$m['year']);
		}
		//$time	=	mktime(
		return $ret;
	}
	public static function init_clock($params){
		$header	=	$params['header'];
		$footer	=	$params['footer'];
		$edate	=	self::get_date($params['endDate']);
		$now		=	time();
		$url		=	$params['url'];
		$left		=	$edate - $now;
	//	print_r($params);
		//echo $left;
		$id			=	time()*rand(0,1000000);
		if ($left < 360000) {
				$script = "
		<div class='multiple_timer' ><a href=".$url.">
			<strong>".$header.":</strong><div class='counter'>
				<div id='clock2_".$id."_h1' class='counter_digit' style='background-position:0px -84px'></div>
				<div id='clock2_".$id."_h2' class='counter_digit' style='background-position:0px -28px'></div>
				<b>часа</b>
			</div>
			<div class='counter'>
				<div id='clock2_".$id."_m1' class='counter_digit_tens' style='background-position:0px -28px'></div>
				<div id='clock2_".$id."_m2' class='counter_digit' style='background-position:0px -168px'></div>
				<b>мин</b>
			</div>
			<div class='counter'>
				<div id='clock2_".$id."_s1' class='counter_digit_tens' style='background-position:0px -84px'></div>
				<div id='clock2_".$id."_s2' class='counter_digit' style='background-position:0px -224px'></div>
				<b>сек</b>
			</div>
			<strong>".$footer.":</strong>
		</div></a>
		<script type='text/javascript'>
			clock_init(".$left.", get_time(), '".$url."', '".$id."', 28);
		</script>";
		}
		else {
				$script = "
		<div class='multiple_timer' ><a href=".$url.">
			<strong>".$header.":</strong><div class='counter'>
				<div id='clock2_".$id."_h1' class='counter_digit' style='background-position:0px -84px'></div>
				<div id='clock2_".$id."_h2' class='counter_digit' style='background-position:0px -28px'></div>
				<b>дни</b>
			</div>
			<div class='counter'>
				<div id='clock2_".$id."_m1' class='counter_digit_tens' style='background-position:0px -28px'></div>
				<div id='clock2_".$id."_m2' class='counter_digit' style='background-position:0px -168px'></div>
				<b>часове</b>
			</div>
			<div class='counter'>
				<div id='clock2_".$id."_s1' class='counter_digit_tens' style='background-position:0px -84px'></div>
				<div id='clock2_".$id."_s2' class='counter_digit' style='background-position:0px -224px'></div>
				<b>мин</b>
			</div>
			<strong>".$footer.":</strong>
		</div></a>
		<script type='text/javascript'>
			clock_init(".$left.", get_time(), '".$url."', '".$id."', 28);
		</script>";
		}
		
		if ($left == 0 || $left < 0 ) {
			return '';
		}
		else {
		return $script;
		}
	}
	public static function display_options() {
		if ($_POST['submit']){
			$endDate = $_POST['endDate'];
			$url = $_POST['url'];
			$header = $_POST['header'];
			$footer = $_POST['footer'];
		}
	?>
	
			<style>
				#flexoCountdown input[type="text"]{
					margin-top:10px;
					margin-bottom:10px;
					margin-left:35px;
				}
			</style>
	<div id="flexoCountdown">
	<form method="POST">
		</br>endDate<input style="width: 100px;" type="text" name="endDate" value="<?php echo $endDate; ?>" />
		</br>for example:  20.09.2011 10:30
		</br>url<input style="width: 100px;" type="text" name="url" value="<?php echo $url; ?>" />
		</br>header<input style="width: 100px;" type="text" name="header" value="<?php echo $header; ?>" />
		</br>footer<input style="width: 100px;" type="text" name="footer" value="<?php echo $footer; ?>" />
		
		</br></br><input type="submit" name="submit" value="Generating"></br>
	</dir>
		</br>Generating code<input  type="text" style=" width:900px;" name="gen_text" value= " <?php
			echo "[flexoCountdown ";
			echo " endDate='".$endDate."' ";
			echo "url ='".$url."' " ;
			echo "header ='".$header."' " ;
			echo "footer ='".$footer."' " ;
			echo "]";?>" />
			
			</form>
	<?php	
	}
	
	public static function fb_menu () {
			add_options_page('flexoCountdown settings','flexoCountdown settings','manage_options','flexoCountdown-settings','flexoCountdown::display_options','');
	
	}
}//class

/* =Add admin menu
------------------------------------------*/
if(function_exists('add_action')):
	add_action('admin_menu', 'flexoCountdown::fb_menu');
	
	add_filter('the_content', 'flexoCountdown::the_content', 1);

	add_action('init','flexoCountdown::init');
	add_action('wp_footer', 'flexoCountdown::wp_footer');
endif;
?>